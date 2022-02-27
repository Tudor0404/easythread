##################
Technical Solution
##################

******************************
Advanced Coding Skills Pointer
******************************



***************
System Overview
***************

All logic and UI elements must be in the ./src/ directory, otherwise the code will not be ran, this is dictated by react.

File tree 
=========
.. parsed-literal::  

    easythread
    ┣ public                                   metadata of the website
    ┃ ┣ android-chrome-192x192.png
    ┃ ┣ android-chrome-512x512.png
    ┃ ┣ apple-touch-icon.png
    ┃ ┣ browserconfig.xml
    ┃ ┣ favicon-16x16.png
    ┃ ┣ favicon-32x32.png
    ┃ ┣ favicon.ico
    ┃ ┣ index.html
    ┃ ┣ mstile-150x150.png
    ┃ ┣ robots.txt
    ┃ ┣ safari-pinned-tab.svg
    ┃ ┗ site.webmanifest
    ┣ src                                      logic and website
    ┃ ┣ components                             reusable react components
    ┃ ┃ ┣ button
    ┃ ┃ ┃ ┗ :ref:`Button.tsx`                  buttons
    ┃ ┃ ┣ canvas
    ┃ ┃ ┃ ┗ :ref:`Canvas.tsx`                  main canvas and logic
    ┃ ┃ ┣ dropdown
    ┃ ┃ ┃ ┣ :ref:`Dropdown.tsx`                dropdown menu
    ┃ ┃ ┃ ┗ :ref:`DropdownItem.tsx`            list item for dropdowns
    ┃ ┃ ┣ input
    ┃ ┃ ┃ ┣ :ref:`NumberInput.tsx`             input which only accepts numbers
    ┃ ┃ ┃ ┣ :ref:`Switch.tsx`                  yes or no input
    ┃ ┃ ┃ ┗ :ref:`TextInput.tsx`               input for text
    ┃ ┃ ┣ modal
    ┃ ┃ ┃ ┗ :ref:`Modal.tsx`                   pop-up covering whole page
    ┃ ┃ ┣ separator
    ┃ ┃ ┃ ┗ :ref:`Separator.tsx`               vertical line for toolbar
    ┃ ┃ ┣ sidebar
    ┃ ┃ ┃ ┣ :ref:`ColourBox.tsx`               square displaying a colour
    ┃ ┃ ┃ ┗ :ref:`Sidebar.tsx`                 SVG stroke and fill editor
    ┃ ┃ ┣ toolbar
    ┃ ┃ ┃ ┣ :ref:`OptionsDropdown.tsx`         options dropdown, uses dropdown
    ┃ ┃ ┃ ┗ :ref:`Toolbar.tsx`	               top toolbar
    ┃ ┃ ┗ tooltip
    ┃ ┃ ┃ ┗ :ref:`Tooltip.tsx`	               hover tooltips on buttons
    ┃ ┣ data                                   static data for components
    ┃ ┃ ┣ :ref:`DMCColours.json`               json of DMC threads
    ┃ ┃ ┣ logo.png                             top left logo
    ┃ ┃ ┗ :ref:`options.json`                  options controlling the canvas
    ┃ ┣ lib	                                   Non-UI logic
    ┃ ┃ ┣ canvas
    ┃ ┃ ┃ ┗ :ref:`UndoRedoTool.ts`             unde and redo of the canvas
    ┃ ┃ ┣ stitch                               conversion algorithm
    ┃ ┃ ┃ ┣ convert
    ┃ ┃ ┃ ┃ ┣ :ref:`fillPath.ts`               converts fills
    ┃ ┃ ┃ ┃ ┣ :ref:`rowGutter.ts`              helper function for fillpath
    ┃ ┃ ┃ ┃ ┣ :ref:`runningPath.ts`            converts strokes to running paths
    ┃ ┃ ┃ ┃ ┣ :ref:`satinPath.ts`              converts strokes to satin paths
    ┃ ┃ ┃ ┃ ┗ :ref:`straightSubdivision.ts`    sanitizes lines
    ┃ ┃ ┃ ┣ :ref:`Block.ts`                    data structure for stitch points
    ┃ ┃ ┃ ┣ :ref:`Container.ts`                data structure for the stitch sequence 
    ┃ ┃ ┃ ┣ :ref:`Graph.ts`                    graph data structure to help fillpath
    ┃ ┃ ┃ ┗ :ref:`helpers.ts`                  helper functions
    ┃ ┃ ┣ svg                                  functions to modify SVGs
    ┃ ┃ ┃ ┣ :ref:`copyStyling.ts`              copy styling from one to another
    ┃ ┃ ┃ ┣ :ref:`getLeafItems.ts`             gets all the leaf PathItems 
    ┃ ┃ ┃ ┣ :ref:`itemToPathItem.ts`           converts items to PathItems
    ┃ ┃ ┃ ┣ :ref:`normaliseColours.ts`         normalizes colours to DMC colours 
    ┃ ┃ ┃ ┗ :ref:`removeOverlap.ts`            removes overlaps of SVGs 
    ┃ ┃ ┗ :ref:`eventBus.ts`                   react component communication
    ┃ ┣ styles
    ┃ ┃ ┗ :ref:`App.css`                       initializes tailwindcss
    ┃ ┣ types                                  TypeScript custom types
    ┃ ┃ ┣ :ref:`DMCColour.d.ts` 				
    ┃ ┃ ┗ :ref:`embroideryTypes.d.ts`
    ┃ ┣ App.tsx                                root UI component 
    ┃ ┣ :ref:`index.css`                       sets the font
    ┃ ┣ :ref:`index.tsx`                       entry point of react
    ┃ ┣ :ref:`react-app-env.d.ts`              auto-generated
    ┣ :ref:`package.json`                      package manager
    ┣ :ref:`postcss.config.js` 				
    ┣ :ref:`tailwind.config.js`                tailwind theme config
    ┗ :ref:`tsconfig.json`                     TypeScript config

Code
====

./src/components/button/Button.tsx
----------------------------------

.. code-block:: tsx 
    :linenos:
    :name: Button.tsx
    :caption: Button.tsx

    import React from "react";
    import { usePopper } from "react-popper";
    import useState from "react-usestateref";
    import Tooltip from "../tooltip/Tooltip";

    interface Props {
        children?: any;
        onClick?: any;
        filled?: boolean;
        className?: string;
        toggled?: boolean;
        tooltip?: string;
        disabled?: boolean;
    }

    const Button: React.FC<Props> = (props) => {
        const [referenceElement, setReferenceElement] = useState(null);
        const [popperElement, setPopperElement] = useState(null);
        const [isHover, setHover, hoverRef] = useState<boolean>(false);
        const { styles, attributes } = usePopper(referenceElement, popperElement);

        return (
            <>
                <button
                    onClick={props.onClick}
                    //@ts-ignore
                    ref={setReferenceElement}
                    disabled={props.disabled}
                    className={`
                ${
                    props.filled
                        ? `bg-primary mx-2 bg-opacity-100 py-1 text-white hover:bg-opacity-90 ${
                                props.toggled ? "bg-opacity-90" : ""
                        }`
                        : `bg-black bg-opacity-0 text-black hover:bg-opacity-10 ${
                                props.toggled ? "bg-opacity-10" : ""
                        }`
                }
                rounded-md
                px-1.5
                text-center
                transition-all
                duration-200
                ease-in-out disabled:!bg-opacity-0 
                disabled:!stroke-gray-400
                disabled:text-gray-600
                disabled:hover:!bg-opacity-0
                ${props.className}
            `}
                    onMouseEnter={() => {
                        setHover(true);
                    }}
                    onMouseLeave={() => {
                        setHover(false);
                    }}
                >
                    <p className="m-0 p-0">{props.children}</p>
                </button>
                {props.tooltip && (
                    <Tooltip
                        isHover={isHover}
                        hoverRef={hoverRef}
                        label={props.tooltip}
                        popperAttributes={attributes.popper}
                        popperStyles={styles.popper}
                        setHover={setHover}
                        setPopperElement={setPopperElement}
                    />
                )}
            </>
        );
    };

    export default Button;


./src/components/canvas/Canvas.tsx
----------------------------------

.. code-block:: tsx 
    :linenos:
    :name: Canvas.tsx
    :caption: Canvas.tsx

    import React, { useRef, useEffect } from "react";
    import Paper from "paper";
    import useState from "react-usestateref";
    import Ruler from "@scena/react-ruler";

    import options from "../../data/options.json";
    import eventBus from "../../lib/eventBus";
    import UndoRedoTool from "../../lib/canvas/UndoRedoTool";
    import Container from "../../lib/stitch/Container";
    import removeOverlap from "../../lib/svg/removeOverlap";
    import normaliseColours from "../../lib/svg/normaliseColours";
    import { embroideryTypes } from "../../types/embroideryTypes.d";

    interface Props {}

    const Canvas: React.FC<Props> = (props) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const horizontalRulerRef = useRef<any>(null);
        const verticalRulerRef = useRef<any>(null);
        // prevent selection for a short while after dragging
        const [preventSelect, setPreventSelect, refPreventSelect] = useState(false);
        const [timer, setTimer] = useState<NodeJS.Timeout>();
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [topLeftPos, setTopLeftPos] = useState<paper.Point>(
            new Paper.Point(0, 0)
        );
        const [viewZoom, setViewZoom] = useState(1);

        // click event for paper items
        function onClickItemEvent(e: paper.MouseEvent) {
            // prevent from selecting items below it
            e.stopPropagation();
            // allow for multi selection only if holding control key at the same time
            if (!refPreventSelect.current) {
                if (!e.modifiers.control)
                    Paper.project.selectedItems.forEach((el) => {
                        if (el !== e.target) el.selected = false;
                    });
                e.target.selected = !e.target.selected;
            }
            eventBus.dispatch("selectedItemsChanged", {});
        }

        function updateRulerDimensions() {
            setTopLeftPos(Paper.view.viewToProject(new Paper.Point(0, 0)));
            setViewZoom(Paper.view.zoom);

            if (horizontalRulerRef.current) {
                horizontalRulerRef.current.resize();
            }
            if (verticalRulerRef.current) {
                verticalRulerRef.current.resize();
            }
        }

        // re-centre view
        function setCenter() {
            Paper.view.center = new Paper.Point(
                Paper.project.view.viewSize.width / 2,
                Paper.project.view.viewSize.height / 2
            );
            updateRulerDimensions();
        }

        // add SVG to paper project
        function addSvg(svg: string, title?: string) {
            Paper.project.clear();

            const item = Paper.project.importSVG(svg, {
                insert: false,
                expandShapes: true,
            });

            // add item to new layer, so that the layer can be centered by itself
            let l = new Paper.Layer();
            l.addChild(item);

            Paper.project.getItems({}).forEach((e) => {
                if (e.hasChildren()) return;
                //@ts-ignore
                e.onClick = onClickItemEvent;
            });

            l.position = new Paper.Point(
                Paper.view.viewSize.width / 2,
                Paper.view.viewSize.height / 2
            );

            eventBus.dispatch("setSvgBounds", {
                width: l.strokeBounds.width,
                height: l.strokeBounds.height,
            });

            l.data = { userEditable: true };

            eventBus.dispatch(
                "initialFilename",
                title ? title.replace(/\.[^/.]+$/, "") : "newFile"
            );

            Paper.view.update();
        }

        function handleFileUploaded(e: React.ChangeEvent<HTMLInputElement>) {
            let reader = new FileReader();

            if (!e.target.files) return;

            if (e.target.files[0].type !== "image/svg+xml") return;

            reader.onload = (f: ProgressEvent<FileReader>) => {
                try {
                    if (!f.target || !f.target.result) return;
                    //@ts-ignore
                    addSvg(f.target.result.toString(), e.target.files[0].name);
                } catch {}
            };

            reader.readAsText(e.target.files[0]);
        }

        function zoom(type: "in" | "out") {
            let newZoom = Paper.view.zoom;

            if (type === "in") {
                newZoom = Paper.view.zoom * 1.2;
                newZoom = newZoom > options.maxZoom ? options.maxZoom : newZoom;
            } else {
                newZoom = Paper.view.zoom * 0.8;
                newZoom = newZoom < options.minZoom ? options.minZoom : newZoom;
            }

            Paper.view.zoom = newZoom;

            updateRulerDimensions();
        }

        // convert project into point blocks
        async function convertSvg(layer: paper.Layer) {
            if (Paper.project.layers.length === 0) return false;

            let container = new Container();
            await container.convertToBlocks(layer);

            Paper.project.layers[0].data = {
                sequence: container.sequence,
            };
        }

        // checks if the project has already been converted
        function checkIfHasSequence(): Container | false {
            try {
                if (Paper.project.layers.length === 0) return false;
                if (Paper.project.layers[0].data.sequence.length > 0)
                    return Paper.project.layers[0].data.sequence;
                else return false;
            } catch {
                return false;
            }
        }

        useEffect(() => {
            //@ts-ignore
            Paper.setup(canvasRef.current);

            new Paper.Tool().on({
                // dragging functionality
                mousedrag: (event: paper.ToolEvent) => {
                    event.stopPropagation();
                    event.preventDefault();
                    let pan_offset = event.point.subtract(event.downPoint);
                    Paper.view.center = Paper.view.center.subtract(pan_offset);
                    setPreventSelect(true);
                    updateRulerDimensions();
                },
            });

            Paper.view.on({
                // resize
                resize: () => {
                    Paper.project.layers.forEach((element) => {
                        if (element.data.userEditable === true)
                            element.position = new Paper.Point(
                                Paper.view.viewSize.width / 2,
                                Paper.view.viewSize.height / 2
                            );
                    });
                    updateRulerDimensions();
                },
                // remove selection if not clicked anything, since view.click propagates last, and propagation is stopped when clicked on an element, this will not trigger if clicked over an element which can be selected.
                click: () => {
                    Paper.project.selectedItems.forEach((e) => {
                        e.selected = false;
                    });
                },
            });

            //#region bus events
            eventBus.on("resetView", () => {
                Paper.view.zoom = 1;
                updateRulerDimensions();
                setCenter();
            });

            eventBus.on("resetCenter", () => {
                setCenter();
            });

            eventBus.on("setSelectedStrokeColour", (data: string) => {
                if (Paper.project.selectedItems.length > 0) {
                    UndoRedoTool.addStateDefault();
                    Paper.project.selectedItems.forEach((e) => {
                        e.strokeColor = new Paper.Color(data);
                    });
                }
            });

            eventBus.on("setSelectedFillColour", (data: string) => {
                if (Paper.project.selectedItems.length > 0) {
                    UndoRedoTool.addStateDefault();
                    Paper.project.selectedItems.forEach((e) => {
                        e.fillColor = new Paper.Color(data);
                    });
                }
            });

            eventBus.on("removeSelectedStroke", () => {
                if (Paper.project.selectedItems.length > 0) {
                    UndoRedoTool.addStateDefault();
                    Paper.project.selectedItems.forEach((e) => {
                        e.strokeColor = null;
                    });
                }
            });

            eventBus.on("removeSelectedFill", () => {
                if (Paper.project.selectedItems.length > 0) {
                    UndoRedoTool.addStateDefault();
                    Paper.project.selectedItems.forEach((e) => {
                        e.fillColor = null;
                    });
                }
            });

            eventBus.on("setCanvasLayer", (layer: paper.Layer) => {
                if (layer) {
                    UndoRedoTool.addStateDefault();

                    Paper.project.clear();

                    const newLayer = Paper.project.addLayer(layer);
                    newLayer.children.forEach((e) => {
                        e.onClick = onClickItemEvent;
                        e.selected = false;
                    });

                    eventBus.dispatch("setSvgBounds", {
                        width: newLayer.strokeBounds.width,
                        height: newLayer.strokeBounds.height,
                    });
                }
            });

            eventBus.on("openLocalFile", () => {
                fileInputRef.current?.click();
            });

            eventBus.on(
                "convertSvg",
                async (options: {
                    convertToEmbroidery: boolean;
                    removeOverlap: boolean;
                    averageColours: boolean;
                }) => {
                    if (checkIfHasSequence()) {
                        eventBus.dispatch("conversionFinished", {});
                        return;
                    }

                    UndoRedoTool.addStateDefault();
                    let layerToConvert = Paper.project.layers[0];

                    if (options.averageColours) {
                        normaliseColours();
                    }
                    if (options.removeOverlap) {
                        layerToConvert = await removeOverlap();
                    }
                    if (options.convertToEmbroidery) {
                        await convertSvg(layerToConvert);
                    }
                    eventBus.dispatch("conversionFinished", {});
                }
            );

            eventBus.on("zoom", (type: "in" | "out") => {
                zoom(type);
            });

            eventBus.on("updateRulers", updateRulerDimensions);

            eventBus.on("saveExp", (filename: string) => {
                console.log(checkIfHasSequence());
                if (checkIfHasSequence()) {
                    let temp = new Container();
                    //@ts-ignore
                    temp.sequence = checkIfHasSequence();
                    temp.convertToEmbroidery(embroideryTypes.exp, filename);
                }
            });

            //#endregion

            updateRulerDimensions();

            return eventBus.remove(
                [
                    "resetView",
                    "resetCenter",
                    "setSelectedStrokeColour",
                    "setSelectedFillColour",
                    "removeSelectedStroke",
                    "removeSelectedFill",
                    "setCanvasLayer",
                    "openLocalFile",
                    "resetRulers",
                    "updateRulers",
                    "convertSvg",
                ],
                () => {}
            );
        }, []);

        // prevent selection of items after dragging, for 200ms
        useEffect(() => {
            if (timer) {
                clearTimeout(timer);
            }

            if (preventSelect) {
                setTimer(
                    setTimeout(() => {
                        setPreventSelect(false);
                    }, 200)
                );
            }

            //@ts-ignore
            return () => clearTimeout(timer);
        }, [preventSelect]);

        // scroll rulers to correct postion on canvas
        useEffect(() => {
            if (horizontalRulerRef.current) {
                horizontalRulerRef.current.scroll(topLeftPos.x);
            }
            if (verticalRulerRef.current) {
                verticalRulerRef.current.scroll(topLeftPos.y);
            }
        }, [topLeftPos]);

        return (
            <div className="h-full w-full ">
                <div className="flex h-5 w-full flex-row">
                    <div className="h-5 w-5 bg-gray-700"></div>
                    <div className="w-[calc(100%-20px)]">
                        <Ruler
                            ref={horizontalRulerRef}
                            type="horizontal"
                            height={20}
                            segment={4}
                            zoom={viewZoom}
                            unit={
                                viewZoom < 0.5
                                    ? 250
                                    : viewZoom < 0.7
                                    ? 100
                                    : viewZoom > 3.5
                                    ? 10
                                    : 50
                            }
                            mainLineSize={12}
                            longLineSize={6}
                            shortLineSize={6}
                            backgroundColor="#E5E7EB"
                            lineColor="#374151"
                            textColor="#374151"
                            textOffset={[0, 7]}
                            textFormat={(scale: number) => {
                                if (viewZoom < 0.7)
                                    return (scale / 10).toString() + "cm";
                                else return scale.toString() + "mm";
                            }}
                        ></Ruler>
                    </div>
                </div>
                <div className="flex h-[calc(100%-20px)] w-full flex-row">
                    <div className=" h-full w-5 ">
                        <Ruler
                            type="vertical"
                            width={20}
                            segment={4}
                            ref={verticalRulerRef}
                            zoom={viewZoom}
                            unit={
                                viewZoom < 0.5
                                    ? 250
                                    : viewZoom < 0.7
                                    ? 100
                                    : viewZoom > 3.5
                                    ? 10
                                    : 50
                            }
                            mainLineSize={12}
                            longLineSize={6}
                            shortLineSize={6}
                            backgroundColor="#E5E7EB"
                            lineColor="#374151"
                            textColor="#374151"
                            textOffset={[7, 0]}
                            textFormat={(scale: number) => {
                                if (viewZoom < 0.7)
                                    return (scale / 10).toString() + "cm";
                                else return scale.toString() + "mm";
                            }}
                        ></Ruler>
                    </div>
                    <div className="h-full w-full">
                        <canvas
                            ref={canvasRef}
                            className="h-full w-full"
                            id="canvas"
                            //@ts-ignore
                            resize="true"
                            onWheel={(event) => {
                                let newZoom = Paper.view.zoom;
                                let oldZoom = Paper.view.zoom;

                                if (event.deltaY < 0) {
                                    newZoom = Paper.view.zoom + 0.15;
                                    newZoom =
                                        newZoom > options.maxZoom
                                            ? options.maxZoom
                                            : newZoom;
                                } else {
                                    newZoom = Paper.view.zoom - 0.15;
                                    newZoom =
                                        newZoom < options.minZoom
                                            ? options.minZoom
                                            : newZoom;
                                }

                                let beta = oldZoom / newZoom;

                                let mousePosition = new Paper.Point(
                                    event.clientX,
                                    event.clientY
                                );

                                var viewPosition =
                                    Paper.view.viewToProject(mousePosition);

                                var mpos = viewPosition;
                                var ctr = Paper.view.center;

                                var pc = mpos.subtract(ctr);
                                var offset = mpos
                                    .subtract(pc.multiply(beta))
                                    .subtract(ctr);

                                Paper.view.zoom = newZoom;
                                Paper.view.center = Paper.view.center.add(offset);

                                updateRulerDimensions();
                                Paper.view.update();
                            }}
                        ></canvas>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type={"file"}
                    className="absolute -top-full"
                    accept=".svg"
                    onChange={handleFileUploaded}
                />
            </div>
        );
    };

    export default Canvas;


./src/components/dropdown/Dropdown.tsx
--------------------------------------

.. code-block:: tsx 
    :linenos:
    :name: Dropdown.tsx
    :caption: Dropdown.tsx

    import React, { Fragment } from "react";
    import { usePopper } from "react-popper";
    import { Menu, Transition } from "@headlessui/react";
    import Tooltip from "../tooltip/Tooltip";
    import useState from "react-usestateref";

    interface Props {
        tooltip?: string;
        children: any;
        button: React.ReactElement<any, any> | string;
        buttonStyle?: string;
        contentStyle?: string;
        align: "left" | "right";
    }

    const Dropdown: React.FC<Props> = (props) => {
        const [isHover, setHover, hoverRef] = useState(false);
        const [referenceElement, setReferenceElement] = useState(null);
        const [popperElement, setPopperElement] = useState(null);
        const { styles, attributes } = usePopper(referenceElement, popperElement);

        return (
            <div className="relative h-full">
                <Menu as="div" className=" text-left outline-none">
                    {({ open }) => (
                        <>
                            <div
                                onMouseEnter={() => {
                                    setHover(true);
                                }}
                                onMouseLeave={() => {
                                    setHover(false);
                                }}
                                //@ts-ignore
                                ref={setReferenceElement}
                            >
                                <Menu.Button
                                    className={
                                        props.buttonStyle
                                            ? props.buttonStyle
                                            : `outline-no mx-0.5 flex items-center justify-center rounded-md border-0 bg-black bg-opacity-0 p-1 text-center text-black transition-all duration-200 ease-in-out hover:bg-opacity-10 focus:outline-none disabled:text-gray-600`
                                    }
                                >
                                    {props.button}
                                </Menu.Button>
                            </div>

                            {!open && props.tooltip && (
                                <Tooltip
                                    isHover={isHover}
                                    hoverRef={hoverRef}
                                    label={props.tooltip || ""}
                                    popperAttributes={attributes.popper}
                                    popperStyles={styles.popper}
                                    setHover={setHover}
                                    setPopperElement={setPopperElement}
                                />
                            )}

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items
                                    className={`absolute ${
                                        props.align === "right"
                                            ? "right-0 origin-top-right"
                                            : "left-0 origin-top-left"
                                    } mt-2  items-start justify-start rounded-md bg-white shadow-lg ring-2 ring-black/5 ${
                                        props.contentStyle
                                    }`}
                                >
                                    {props.children}
                                </Menu.Items>
                            </Transition>
                        </>
                    )}
                </Menu>
            </div>
        );
    };

    export default Dropdown;


./src/components/dropdown/DropdownItem.tsx
------------------------------------------

.. code-block:: tsx 
    :linenos:
    :name: DropdownItem.tsx
    :caption: DropdownItem.tsx

    import React from "react";
    import { Menu } from "@headlessui/react";

    interface Props {
        label: string;
        icon?: React.ComponentProps<"svg">;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        disabled?: boolean;
    }

    const DropdownItem: React.FC<Props> = (props) => {
        return (
            <Menu.Item>
                {({ active }) => (
                    <button
                        disabled={props.disabled}
                        className={`${
                            active ? "bg-black/20" : ""
                        } group flex w-full items-center rounded-md px-2 py-1 text-gray-900 disabled:text-gray-500 disabled:hover:bg-transparent`}
                        onClick={props.onClick}
                    >
                        {props.icon || null}
                        {props.label}
                    </button>
                )}
            </Menu.Item>
        );
    };

    export default DropdownItem;

./src/components/input/NumberInput.tsx
--------------------------------------

.. code-block:: tsx 
    :linenos:
    :name: NumberInput.tsx
    :caption: NumberInput.tsx

    import React from "react";

    interface Props {
        value: string;
        setValue: any;
        placeholder?: string;
        className?: string;
        disabled?: boolean;
        onKeyUp?: any;
    }

    const NumberInput: React.FC<Props> = (props) => {
        return (
            <div>
                <input
                    disabled={props.disabled}
                    value={props.value}
                    onChange={(e) => {
                        props.setValue(e.target.value);
                    }}
                    placeholder={props.placeholder}
                    className={` focus:border-primary box-border w-auto border-2 border-slate-300 border-opacity-100 px-0.5 py-0 font-mono outline-none transition-all duration-200 hover:border-opacity-100 focus:border-opacity-100 focus:outline-none disabled:bg-slate-200 disabled:text-slate-400 ${props.className}`}
                    onKeyPress={(e) => {
                        if (
                            // regex to only allow digits, one decimal point, no negative sign
                            (/[0-9]*\.[0-9]*/.test(props.value) && e.key === ".") ||
                            !/[0-9]|\./.test(e.key)
                        ) {
                            e.preventDefault();
                        }
                    }}
                    onKeyUp={props.onKeyUp}
                ></input>
            </div>
        );
    };

    export default NumberInput;


./src/components/input/Switch.tsx
---------------------------------

.. code-block:: tsx 
    :linenos:
    :name: Switch.tsx
    :caption: Switch.tsx

    import React from "react";
    import { Switch as HeadlessSwitch } from "@headlessui/react";

    interface Props {
        active: boolean;
        setActive: React.Dispatch<React.SetStateAction<boolean>>;
    }

    const Switch: React.FC<Props> = (props) => {
        return (
            <HeadlessSwitch
                checked={props.active}
                onChange={props.setActive}
                className={`${props.active ? "bg-primary" : "bg-gray-400"}
            relative mx-1 inline-flex h-[18px] w-[34px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 `}
            >
                <span
                    aria-hidden="true"
                    className={`${props.active ? "translate-x-4" : "translate-x-0"}
                pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
            </HeadlessSwitch>
        );
    };

    export default Switch;


./src/components/input/TextInput.tsx
------------------------------------

.. code-block:: tsx 
    :linenos:
    :name: TextInput.tsx
    :caption: TextInput.tsx

    import React, { useState } from "react";

    interface Props {
        value: string;
        setValue: React.Dispatch<React.SetStateAction<string>>;
        placeholder?: string;
        className?: string;
        disabled?: boolean;
        type?: string;
    }

    const TextInput: React.FC<Props> = (props) => {
        return (
            <div>
                <input
                    disabled={props.disabled}
                    value={props.value}
                    onChange={(e) => {
                        props.setValue(e.target.value);
                    }}
                    placeholder={props.placeholder}
                    className={` focus:border-b-primary box-border w-auto border-b-2 border-slate-300 border-opacity-0 p-1 pb-0 outline-none transition-all duration-200 hover:border-opacity-100 focus:border-opacity-100 focus:outline-none disabled:bg-slate-200 disabled:text-slate-400 ${props.className}`}
                    type={props.type}
                ></input>
            </div>
        );
    };

    export default TextInput;


./src/components/modal/Modal.tsx
--------------------------------

.. code-block:: tsx 
    :linenos:
    :name: Modal.tsx
    :caption: Modal.tsx

    import React from "react";
    import { Dialog, Transition } from "@headlessui/react";
    import Button from "../button/Button";

    interface Props {
        isOpen: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
        title?: string | null;
        description?: string | null;
        preventAutoClose?: boolean;
    }

    const Modal: React.FC<Props> = (props) => {
        return (
            <Transition
                show={props.isOpen}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Dialog
                    className="fixed inset-0 z-10 flex min-h-screen min-w-full items-center justify-center overflow-y-auto"
                    open={props.isOpen}
                    onClose={() => {
                        if (!props.preventAutoClose) props.setOpen(false);
                    }}
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-5" />
                    <div
                        className={`z-40 flex min-h-[200px] min-w-[300px] flex-col items-center ${
                            !(props.children && props.description)
                                ? "justify-between"
                                : "justify-start"
                        } gap-4 rounded-md bg-white bg-opacity-100 p-3 shadow-lg outline-black/30`}
                    >
                        <div>
                            {props.title && (
                                <Dialog.Title className="text-xl">
                                    {props.title}
                                </Dialog.Title>
                            )}
                        </div>
                        <div
                            className={`flex ${
                                !(props.children && props.description)
                                    ? "flex-grow"
                                    : ""
                            } flex-col items-center justify-center`}
                        >
                            <div className="flex flex-grow items-center justify-center">
                                {props.description && (
                                    <Dialog.Description>
                                        {props.description}
                                    </Dialog.Description>
                                )}
                            </div>

                            {props.children}

                            <div className="flex flex-grow items-end justify-end">
                                {!props.preventAutoClose && (
                                    <Button
                                        onClick={() => props.setOpen(false)}
                                        filled
                                        className="place-self-end"
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    };

    export default Modal;

./src/components/separator/Separator.tsx
----------------------------------------

.. code-block:: tsx 
    :linenos:
    :name: Separator.tsx
    :caption: Separator.tsx

    import React from "react";

    const Separator: React.FC = () => {
        return (
            <div className="mx-1 inline-block h-[20px] border-l-[1px] border-gray-400 p-0"></div>
        );
    };

    export default Separator;


./src/components/sidebar/ColourBox.tsx
--------------------------------------

.. code-block:: tsx 
    :linenos:
    :name: ColourBox.tsx
    :caption: ColourBox.tsx

    import React from "react";

    interface Props {
        hex: string;
        onMouseLeave: React.MouseEventHandler<HTMLDivElement>;
        onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
        onClick: React.MouseEventHandler<HTMLDivElement>;
    }

    const ColourBox: React.FC<Props> = (props) => {
        return (
            <div
                className="h-6 w-6 border-2 border-black/20"
                style={{ background: props.hex }}
                onClick={props.onClick}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
            >
                {" "}
            </div>
        );
    };

    export default ColourBox;



./src/components/sidebar/Sidebar.tsx
------------------------------------

.. code-block:: tsx 
    :linenos:
    :name: Sidebar.tsx
    :caption: Sidebar.tsx

    import React, { useState, useEffect } from "react";
    import useResizeObserver from "use-resize-observer";

    import Button from "../button/Button";
    import DMCColours from "../../data/DMCColours.json";
    import ColourBox from "./ColourBox";
    import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
    import type { DMCColour } from "../../types/DMCColour";
    import normaliseColours from "../../lib/svg/normaliseColours";
    import eventBus from "../../lib/eventBus";
    import UndoRedoTool from "../../lib/canvas/UndoRedoTool";

    const Sidebar: React.FC = () => {
        const defaultDMC: DMCColour = {
            "#RGB": "",
            "Floss Name": "",
            DMC: "",
        };

        const [currPage, setCurrPage] = useState<number>(1);
        const [coloursPerPage, setColoursPerPage] = useState<number>(60);
        const [maxPerPage, setMaxPerPage] = useState(
            Math.ceil(DMCColours.length / coloursPerPage)
        );
        const [softColour, setSoftColour] = useState<DMCColour>(defaultDMC);
        const [hardColour, setHardColour] = useState<DMCColour>({
            "#RGB": "",
            "Floss Name": "",
            DMC: "",
        });
        const { ref } = useResizeObserver({
            onResize: ({ width }) => {
                if (width !== undefined)
                    setColoursPerPage(
                        Math.floor((width / 26) * 7) < 10
                            ? 10
                            : Math.floor((width / 26) * 7)
                    );
                setCurrPage(1);
            },
        });

        useEffect(() => {
            setMaxPerPage(Math.ceil(DMCColours.length / coloursPerPage));
        }, [coloursPerPage]);

        return (
            <div className="flex h-full min-w-[300px] basis-1/4 flex-col items-center justify-start overflow-y-scroll bg-white pt-3 shadow-inner">
                <h1 className="mb-1 border-b-2 text-xl">Colours</h1>
                <div className="flex w-[90%] flex-row flex-wrap items-center justify-start ">
                    <div className="my-2 flex min-h-[100px] w-full flex-col justify-between rounded-md bg-stone-200 p-1 shadow-xl">
                        <div className="flex flex-row items-start justify-start">
                            <div className="flex flex-col items-start justify-start">
                                <div
                                    className="min-h-[40px] min-w-[40px] rounded-lg border-2 border-black/20"
                                    style={{
                                        background:
                                            softColour["#RGB"] ||
                                            hardColour["#RGB"],
                                    }}
                                ></div>
                                <p>
                                    <strong>
                                        {softColour.DMC || hardColour.DMC || "code"}
                                    </strong>
                                </p>
                            </div>
                            <div className="flex flex-col px-2">
                                <p className=" text-lg text-gray-800">
                                    <strong>
                                        {softColour["Floss Name"] ||
                                            hardColour["Floss Name"] ||
                                            "Name"}
                                    </strong>{" "}
                                    <span className="text-sm">
                                        {softColour["#RGB"] ||
                                            hardColour["#RGB"] ||
                                            "#hex"}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="grid w-full grid-cols-3">
                            <p>
                                <strong>R</strong>{" "}
                                {softColour?.Red || hardColour?.Red || "---"}
                            </p>
                            <p>
                                <strong>G</strong>{" "}
                                {softColour?.Blue || hardColour?.Blue || "---"}
                            </p>
                            <p>
                                <strong>B</strong>{" "}
                                {softColour?.Green || hardColour?.Green || "---"}
                            </p>
                        </div>
                    </div>
                    <div ref={ref} className="h-[200px] items-start justify-center">
                        <div className="flex w-full flex-row flex-wrap items-start justify-center">
                            {DMCColours.slice(
                                (currPage - 1) * coloursPerPage,
                                currPage * coloursPerPage + 1 >
                                    DMCColours.length - 1
                                    ? DMCColours.length
                                    : currPage * coloursPerPage + 1
                            ).map((e, i) => {
                                return (
                                    <ColourBox
                                        key={i}
                                        hex={e["#RGB"]}
                                        onClick={() => setHardColour(e)}
                                        onMouseLeave={() =>
                                            setSoftColour(defaultDMC)
                                        }
                                        onMouseEnter={() => setSoftColour(e)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between">
                        <Button
                            onClick={() => {
                                setCurrPage(
                                    currPage === 1 ? maxPerPage : currPage - 1
                                );
                            }}
                            className="border-2 p-1"
                            tooltip="previous page"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </Button>
                        <p className="select-none">
                            {currPage} of {maxPerPage}
                        </p>
                        <Button
                            onClick={() => {
                                setCurrPage(
                                    currPage === maxPerPage ? 1 : currPage + 1
                                );
                            }}
                            className="border-2 p-1"
                            tooltip="next page"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </Button>
                    </div>
                    <Button
                        className="self-place-center my-2 w-full"
                        filled
                        onClick={() => {
                            UndoRedoTool.addStateDefault();
                            normaliseColours();
                        }}
                    >
                        Normalise colours
                    </Button>
                    <div className="my-1 grid w-full grid-cols-2 gap-2">
                        <Button
                            className="self-place-center !m-0 w-full"
                            filled
                            onClick={() => {
                                if (softColour["#RGB"])
                                    eventBus.dispatch(
                                        "setSelectedStrokeColour",
                                        softColour["#RGB"]
                                    );
                                else if (hardColour["#RGB"])
                                    eventBus.dispatch(
                                        "setSelectedStrokeColour",
                                        hardColour["#RGB"]
                                    );
                            }}
                        >
                            Set stroke
                        </Button>
                        <Button
                            className="self-place-center !m-0 w-full"
                            filled
                            onClick={() => {
                                if (softColour["#RGB"]) {
                                    eventBus.dispatch(
                                        "setSelectedFillColour",
                                        softColour["#RGB"]
                                    );
                                } else if (hardColour["#RGB"]) {
                                    eventBus.dispatch(
                                        "setSelectedFillColour",
                                        hardColour["#RGB"]
                                    );
                                }
                            }}
                        >
                            Set fill
                        </Button>
                        <Button
                            className="self-place-center !m-0 w-full p-0"
                            filled
                            onClick={() => {
                                eventBus.dispatch("removeSelectedStroke", {});
                            }}
                        >
                            Remove stroke
                        </Button>
                        <Button
                            className="self-place-center !m-0 w-full"
                            filled
                            onClick={() => {
                                eventBus.dispatch("removeSelectedFill", {});
                            }}
                        >
                            Remove fill
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    export default Sidebar;



./src/components/toolbar/OptionsDropdown.tsx
--------------------------------------------

.. code-block:: tsx 
    :linenos:
    :name: OptionsDropdown.tsx
    :caption: OptionsDropdown.tsx

    import React, { useEffect } from "react";
    import { CogIcon } from "@heroicons/react/outline";

    import Switch from "../input/Switch";
    import Dropdown from "../dropdown/Dropdown";
    import NumberInput from "../input/NumberInput";
    import { useStorageState } from "react-storage-hooks";

    interface Props {
        isConvertToEmbroidery: boolean;
        setConvertToEmbroidery: React.Dispatch<React.SetStateAction<boolean>>;
        isRemoveOverlap: boolean;
        setRemoveOverlap: React.Dispatch<React.SetStateAction<boolean>>;
        isAverageOutColours: boolean;
        setAverageOutColours: React.Dispatch<React.SetStateAction<boolean>>;
    }

    const OptionsDropdown: React.FC<Props> = (props) => {
        const [stitchLength, setStitchLength] = useStorageState<string>(
            localStorage,
            "stitchLength",
            "2.7"
        );
        const [spaceBetweenNormals, setSpaceBetweenNormals] =
            useStorageState<string>(localStorage, "spaceBetweenNormals", "1");
        const [satinStitchLength, setSatinStitchLength] = useStorageState<string>(
            localStorage,
            "satinStitchLength",
            "10"
        );
        const [fillGutterSpacing, setFillGutterSpacing] = useStorageState<string>(
            localStorage,
            "fillGutterSpacing",
            "1"
        );

        // save hook data directly to local storage, allows for non-React.FC to access them
        useEffect(() => {
            window.localStorage.setItem("stitchLength", stitchLength);
        }, [stitchLength]);
        useEffect(() => {
            window.localStorage.setItem("spaceBetweenNormals", spaceBetweenNormals);
        }, [spaceBetweenNormals]);
        useEffect(() => {
            window.localStorage.setItem("satinStitchLength", satinStitchLength);
        }, [satinStitchLength]);
        useEffect(() => {
            window.localStorage.setItem("fillGutterSpacing", fillGutterSpacing);
        }, [fillGutterSpacing]);

        return (
            <Dropdown
                button={<CogIcon className="h-5 w-5 " stroke="inherit" />}
                align="right"
                tooltip="conversion settings"
            >
                <div className="flex flex-col items-start justify-start">
                    <div className="flex w-[250px] flex-row items-center py-1">
                        <Switch
                            active={props.isConvertToEmbroidery}
                            setActive={props.setConvertToEmbroidery}
                        />
                        <p
                            className="col-span-4 mt-0.5 select-none flex-nowrap"
                            onClick={() =>
                                props.setConvertToEmbroidery(
                                    !props.isConvertToEmbroidery
                                )
                            }
                        >
                            Convert SVG to embroidery
                        </p>
                    </div>
                    <div className="flex w-[250px] flex-row items-center py-1">
                        <Switch
                            active={props.isRemoveOverlap}
                            setActive={props.setRemoveOverlap}
                        />
                        <p
                            className="col-span-4 mt-0.5 select-none flex-nowrap"
                            onClick={() =>
                                props.setRemoveOverlap(!props.isRemoveOverlap)
                            }
                        >
                            Remove overlapping paths
                        </p>
                    </div>
                    <div className="flex w-[250px] flex-row items-center py-1">
                        <Switch
                            active={props.isAverageOutColours}
                            setActive={props.setAverageOutColours}
                        />
                        <p
                            className="col-span-4 mt-0.5 select-none flex-nowrap"
                            onClick={() =>
                                props.setAverageOutColours(
                                    !props.isAverageOutColours
                                )
                            }
                        >
                            Average colours to DMC
                        </p>
                    </div>
                    <div className="flex w-[250px] flex-row items-center justify-start p-1">
                        <p className="mr-2">Stitch length</p>
                        <NumberInput
                            className="mx-0.5 max-w-[70px] !px-0.5 !py-0"
                            setValue={setStitchLength}
                            value={stitchLength}
                        ></NumberInput>
                        <p>mm</p>
                    </div>
                    <div className="flex w-[250px] flex-row items-center justify-start p-1">
                        <p className="mr-2">Satin spacing</p>
                        <NumberInput
                            className="mx-0.5 max-w-[70px] !px-0.5 !py-0"
                            setValue={setSpaceBetweenNormals}
                            value={spaceBetweenNormals}
                        ></NumberInput>
                        <p>mm</p>
                    </div>
                    <div className="flex w-[250px] flex-row items-center justify-start p-1">
                        <p className="mr-2">Satin stitch length</p>
                        <NumberInput
                            className="mx-0.5 max-w-[70px] !px-0.5 !py-0"
                            setValue={setSatinStitchLength}
                            value={satinStitchLength}
                        ></NumberInput>
                        <p>mm</p>
                    </div>
                    <div className="flex w-[250px] flex-row items-center justify-start p-1">
                        <p className="mr-2">Fill gutter spacing</p>
                        <NumberInput
                            className="mx-0.5 max-w-[70px] !px-0.5 !py-0"
                            setValue={setFillGutterSpacing}
                            value={fillGutterSpacing}
                        ></NumberInput>
                        <p>mm</p>
                    </div>
                </div>
            </Dropdown>
        );
    };

    export default OptionsDropdown;



./src/components/toolbar/Toolbar.tsx
------------------------------------

.. code-block:: tsx 
    :linenos:
    :name: Toolbar.tsx
    :caption: Toolbar.tsx

    import React, { useEffect, useState } from "react";
    import Button from "../button/Button";
    import {
        ArrowLeftIcon,
        ArrowRightIcon,
        ZoomInIcon,
        ZoomOutIcon,
        ArrowsExpandIcon,
        DocumentAddIcon,
        CubeTransparentIcon,
        DocumentDownloadIcon,
    } from "@heroicons/react/outline";
    import Paper from "paper";
    import FileSaver from "file-saver";

    import Logo from "../../data/logo.png";
    import TextInput from "../input/TextInput";
    import Separator from "../separator/Separator";
    import OptionsDropdown from "./OptionsDropdown";
    import Dropdown from "../dropdown/Dropdown";
    import DropdownItem from "../dropdown/DropdownItem";
    import eventBus from "../../lib/eventBus";
    import UndoRedoTool from "../../lib/canvas/UndoRedoTool";
    import NumberInput from "../input/NumberInput";
    import removeOverlap from "../../lib/svg/removeOverlap";
    import Modal from "../modal/Modal";

    interface Props {}

    const Toolbar: React.FC<Props> = (props) => {
        const [filename, setFilename] = useState<string>("");
        const [width, setWidth] = useState<string>("");
        const [height, setHeight] = useState<string>("");
        const [isOutlineShown, setOutlineShown] = useState<boolean>(false);
        const [isUndo, setUndo] = useState<boolean>(false);
        const [isRedo, setRedo] = useState<boolean>(false);
        const [areItemsSelected, setItemsSelected] = useState<boolean>(false);
        const [stroke, setStroke] = useState<string>("");
        const [isModalOpen, setModalOpen] = useState<boolean>(false);

        const [isConvertToEmbroidery, setConvertToEmbroidery] =
            useState<boolean>(true);
        const [isRemoveOverlap, setRemoveOverlap] = useState<boolean>(true);
        const [isAverageOutColours, setAverageOutColours] = useState<boolean>(true);

        useEffect(() => {
            if (Paper.project)
                Paper.project.getItems({}).forEach((e) => {
                    e.selected = isOutlineShown;
                });
            eventBus.dispatch("selectedItemsChanged", {});
        }, [isOutlineShown]);

        useEffect(() => {
            eventBus.on(
                "setSvgBounds",
                ({ width, height }: { width: number; height: number }) => {
                    setWidth(width.toFixed(3));
                    setHeight(height.toFixed(3));
                }
            );

            eventBus.on("undoAvailable", (state: boolean) => {
                setUndo(state);
            });

            eventBus.on("redoAvailable", (state: boolean) => {
                setRedo(state);
            });

            eventBus.on("initialFilename", (title: string) => {
                setFilename(title);
            });

            eventBus.on("selectedItemsChanged", () => {
                let len = Paper.project.selectedItems.length;

                // update the stroke input, if multiple items with different widths are selected, leave it empty
                if (len > 0) {
                    setItemsSelected(true);
                    let strokeWidth: string =
                        Paper.project.selectedItems[0].strokeWidth.toString();

                    if (len > 1) {
                        for (let i = 1; i < len; i++) {
                            if (
                                Paper.project.selectedItems[
                                    i
                                ].strokeWidth.toString() !== strokeWidth
                            ) {
                                strokeWidth = "";
                                break;
                            }
                        }
                    }
                    setStroke(strokeWidth);
                } else setItemsSelected(false);
            });

            eventBus.on("conversionFinished", () => {
                setModalOpen(false);
            });

            return eventBus.remove(
                [
                    "setSvgBounds",
                    "undoAvailable",
                    "redoAvailable",
                    "selectedItemsChanged",
                    "initialFilename",
                    "conversionFinished",
                ],
                () => {}
            );
        }, []);

        useEffect(() => {
            if (stroke !== "") {
                Paper.project.selectedItems.forEach((e) => {
                    e.strokeWidth = parseFloat(stroke);
                });
            }
        }, [stroke]);

        function saveFileSvg() {
            if (Paper.project.layers.length < 0) return;

            let markup = Paper.project
                .exportSVG({
                    bounds: "content",
                    asString: true,
                })
                .toString();

            FileSaver(new Blob([markup], { type: "image/svg+xml" }), filename);
        }

        // updates the dimensions of the SVG on enter
        function onEnterDimensions(e: KeyboardEvent) {
            if (e.key === "Enter") {
                try {
                    UndoRedoTool.addStateDefault();
                    const initWidth = Paper.project.layers[0].strokeBounds.width;
                    const initHeight = Paper.project.layers[0].strokeBounds.height;

                    const widthMultiple =
                        Number(
                            ((parseFloat(width) - initWidth) / initWidth).toFixed(
                                10
                            )
                        ) + 1;
                    const heightMultiple =
                        Number(
                            (
                                (parseFloat(height) - initHeight) /
                                initHeight
                            ).toFixed(10)
                        ) + 1;

                    const newWidth = Number(
                        (
                            initWidth *
                            (widthMultiple === 1 ? heightMultiple : widthMultiple)
                        ).toFixed(3)
                    );

                    const newHeight = Number(
                        (
                            initHeight *
                            (widthMultiple === 1 ? heightMultiple : widthMultiple)
                        ).toFixed(3)
                    );

                    let rectBounds = new Paper.Rectangle(
                        Paper.project.view.bounds.width / 2 - newWidth / 2,
                        Paper.project.view.bounds.height / 2 - newHeight / 2,
                        newWidth,
                        newHeight
                    );

                    Paper.project.layers[0].fitBounds(rectBounds);

                    Paper.project.layers[0].position = new Paper.Point(
                        Paper.view.viewSize.width / 2,
                        Paper.view.viewSize.height / 2
                    );

                    if (rectBounds) {
                        setHeight(rectBounds.height.toFixed(3));
                        setWidth(rectBounds.width.toFixed(3));
                    }

                    eventBus.dispatch("resetCenter", {});
                } catch {}
            }
        }

        useEffect(() => {
            if (isModalOpen) {
                setTimeout(
                    () =>
                        eventBus.dispatch("convertSvg", {
                            convertToEmbroidery: isConvertToEmbroidery,
                            removeOverlap: isRemoveOverlap,
                            averageColours: isAverageOutColours,
                        }),
                    500
                );
            }
        }, [isModalOpen]);

        const buttonStyle =
            "bg-black bg-opacity-0 text-black hover:bg-opacity-10 rounded-md px-1.5 text-center transition-all duration-200 ease-in-out";

        return (
            <div>
                <div className="w-screen bg-white shadow-sm">
                    {/*Upper Toolbar*/}
                    <div className="flex flex-row items-center justify-between border-b-[0.8px] px-3 pt-2 pb-1">
                        <div className="flex flex-row items-center justify-start">
                            <div className="mr-2">
                                <img
                                    src={Logo}
                                    className="row-span-2 "
                                    alt="EasyThread logo"
                                    width={36}
                                    height={36}
                                ></img>
                            </div>

                            <div className="flex flex-col">
                                <div>
                                    <TextInput
                                        placeholder="Untitled File"
                                        className="rounded-none text-lg"
                                        value={filename}
                                        setValue={setFilename}
                                    ></TextInput>
                                </div>
                                <div className="flex flex-row ">
                                    <Dropdown
                                        button={<p>File</p>}
                                        buttonStyle={buttonStyle}
                                        align="left"
                                        contentStyle="min-w-[150px]"
                                    >
                                        <DropdownItem
                                            label="Open SVG"
                                            onClick={() => {
                                                eventBus.dispatch(
                                                    "openLocalFile",
                                                    {}
                                                );
                                            }}
                                        />
                                        <DropdownItem
                                            label="Save SVG"
                                            onClick={saveFileSvg}
                                        />
                                        <DropdownItem
                                            label="Save EXP"
                                            onClick={() => {
                                                eventBus.dispatch(
                                                    "saveExp",
                                                    filename
                                                );
                                            }}
                                        />
                                    </Dropdown>
                                    <Dropdown
                                        button={<p>Edit</p>}
                                        buttonStyle={buttonStyle}
                                        align="left"
                                        contentStyle="min-w-[150px]"
                                    >
                                        <DropdownItem
                                            label="Undo"
                                            disabled={!isUndo}
                                            onClick={UndoRedoTool.undo}
                                        />
                                        <DropdownItem
                                            label="Redo"
                                            disabled={!isRedo}
                                            onClick={UndoRedoTool.redo}
                                        />
                                        <DropdownItem
                                            label="Remove overlap"
                                            onClick={removeOverlap}
                                        />
                                    </Dropdown>
                                    <Dropdown
                                        button={<p>View</p>}
                                        buttonStyle={buttonStyle}
                                        align="left"
                                        contentStyle="min-w-[150px]"
                                    >
                                        <DropdownItem
                                            label="Zoom in"
                                            onClick={() => {
                                                eventBus.dispatch("zoom", "in");
                                            }}
                                        />
                                        <DropdownItem
                                            label="Zoom out"
                                            onClick={() => {
                                                eventBus.dispatch("zoom", "out");
                                            }}
                                        />
                                        <DropdownItem
                                            label="Reset zoom"
                                            onClick={() => {
                                                eventBus.dispatch("resetView", {});
                                            }}
                                        />
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Lower Toolbar*/}
                    <div className="prose-p:leading-1 prose-p:text-center mt-0.5 flex flex-row items-center justify-start stroke-gray-700 py-1 text-gray-700">
                        {/*Undo*/}
                        <Button
                            className="mx-0.5 ml-4 !p-1"
                            tooltip="undo"
                            disabled={!isUndo}
                            onClick={() => {
                                UndoRedoTool.undo();
                            }}
                        >
                            <ArrowLeftIcon className="h-5 w-5" stroke="inherit" />
                        </Button>
                        {/*Redo*/}
                        <Button
                            className="mx-0.5 !p-1"
                            tooltip="redo"
                            disabled={!isRedo}
                            onClick={() => {
                                UndoRedoTool.redo();
                            }}
                        >
                            <ArrowRightIcon className="h-5 w-5" stroke="inherit" />
                        </Button>

                        <Separator />
                        <Button
                            className="mx-0.5 !p-1"
                            tooltip="open file"
                            onClick={() => {
                                eventBus.dispatch("openLocalFile", {});
                            }}
                        >
                            <DocumentAddIcon className="h-5 w-5" stroke="inherit" />
                        </Button>
                        <Button
                            className="mx-0.5 !p-1"
                            tooltip="download file"
                            onClick={saveFileSvg}
                        >
                            <DocumentDownloadIcon
                                className="h-5 w-5"
                                stroke="inherit"
                            />
                        </Button>

                        <Separator />
                        {/*Sizing*/}
                        <p className="mx-0.5">width</p>
                        <NumberInput
                            setValue={setWidth}
                            value={width}
                            onKeyUp={onEnterDimensions}
                            className="focus:border-primary mx-0.5 max-w-[70px] !border-2 !border-opacity-100 !px-0.5 !py-0 font-mono"
                        ></NumberInput>
                        <p className="mx-0.5">mm</p>
                        <p className="mx-0.5 ml-2">height</p>
                        <NumberInput
                            setValue={setHeight}
                            onKeyUp={onEnterDimensions}
                            value={height}
                            className="focus:border-primary mx-0.5 max-w-[70px] !border-2 !border-opacity-100 !px-0.5 !py-0 font-mono"
                        ></NumberInput>
                        <p className="mx-0.5">mm</p>

                        <Button
                            className="mx-0.5 !p-1"
                            tooltip="toggle outline"
                            onClick={() => {
                                setOutlineShown(!isOutlineShown);
                            }}
                        >
                            <CubeTransparentIcon
                                className="h-5 w-5"
                                stroke="inherit"
                            />
                        </Button>

                        <Separator />
                        <Button
                            className="mx-0.5 !p-1"
                            tooltip="zoom in"
                            onClick={() => {
                                eventBus.dispatch("zoom", "in");
                            }}
                        >
                            <ZoomInIcon className="h-5 w-5" stroke="inherit" />
                        </Button>
                        <Button
                            className="mx-0.5 !p-1"
                            tooltip="zoom out"
                            onClick={() => {
                                eventBus.dispatch("zoom", "out");
                            }}
                        >
                            <ZoomOutIcon className="h-5 w-5" stroke="inherit" />
                        </Button>
                        <Button
                            className="mx-0.5 !p-1"
                            tooltip="reset view"
                            onClick={() => {
                                eventBus.dispatch("resetView", {});
                            }}
                        >
                            <ArrowsExpandIcon
                                className="h-5 w-5"
                                stroke="inherit"
                            />
                        </Button>

                        <Separator />
                        <Button
                            filled
                            className="!mx-0.5 !py-0.5 !px-1"
                            tooltip="convert to embroidery"
                            disabled={isModalOpen}
                            onClick={() => {
                                setModalOpen(true);
                            }}
                        >
                            Convert
                        </Button>
                        <OptionsDropdown
                            isAverageOutColours={isAverageOutColours}
                            setAverageOutColours={setAverageOutColours}
                            isConvertToEmbroidery={isConvertToEmbroidery}
                            setConvertToEmbroidery={setConvertToEmbroidery}
                            isRemoveOverlap={isRemoveOverlap}
                            setRemoveOverlap={setRemoveOverlap}
                        />
                        {areItemsSelected && (
                            <>
                                <Separator />
                                <p className="mx-0.5">stroke</p>
                                <NumberInput
                                    setValue={setStroke}
                                    value={stroke}
                                    className="focus:border-primary mx-0.5 max-w-[50px] !border-2 !border-opacity-100 !px-0.5 !py-0 font-mono"
                                ></NumberInput>
                                <p className="mx-0.5">mm</p>
                            </>
                        )}
                    </div>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    setOpen={setModalOpen}
                    title="Converting..."
                    preventAutoClose
                ></Modal>
            </div>
        );
    };

    export default Toolbar;



./src/components/tooltip/Tooltip.tsx
------------------------------------

.. code-block:: tsx 
    :linenos:
    :name: Tooltip.tsx
    :caption: Tooltip.tsx

    import React, { useEffect, useState } from "react";

    interface Props {
        isHover: boolean;
        setHover: React.Dispatch<React.SetStateAction<boolean>>;
        hoverRef: any;
        label: string;
        setPopperElement: React.Dispatch<React.SetStateAction<null>>;
        popperAttributes:
            | {
                    [key: string]: string;
            }
            | undefined;
        popperStyles: React.CSSProperties;
    }

    const Tooltip: React.FC<Props> = (props) => {
        const [isShown, setShown] = useState(false);

        useEffect(() => {
            setShown(false);
            const timeout = setTimeout(() => {
                if (props.hoverRef.current) setShown(true);
                else setShown(false);
            }, 1000);

            return clearTimeout(timeout);
        }, [props.isHover]);

        return isShown ? (
            <div
                className="mt-2 rounded-md bg-gray-600 p-1 text-sm text-white"
                /*@ts-ignore*/
                ref={props.setPopperElement}
                style={props.popperStyles}
                {...props.popperAttributes}
            >
                {props.label}
            </div>
        ) : null;
    };

    export default Tooltip;



./src/data/DMCColours.json
--------------------------

This is only a small extract, the full file is too large

.. code-block:: json
    :linenos:
    :name: DMCColours.json
    :caption: DMCColours.json

    [{"DMC":"3713","Floss Name":"Salmon Very Light","Red":255,"Green":226,"Blue":226,"#RGB":"#FFE2E2"},{"DMC":"761","Floss Name":"Salmon Light","Red":255,"Green":201,"Blue":201,"#RGB":"#FFC9C9"},{"DMC":"760","Floss Name":"Salmon","Red":245,"Green":173,"Blue":173,"#RGB":"#F5ADAD"},{"DMC":"3712","Floss Name":"Salmon Medium","Red":241,"Green":135,"Blue":135,"#RGB":"#F18787"},{"DMC":"3328","Floss Name":"Salmon Dark","Red":227,"Green":109,"Blue":109,"#RGB":"#E36D6D"},{"DMC":"347","Floss Name":"Salmon Very Dark","Red":191,"Green":45,"Blue":45,"#RGB":"#BF2D2D"},{"DMC":"353","Floss Name":"Peach","Red":254,"Green":215,"Blue":204,"#RGB":"#FED7CC"},{"DMC":"352","Floss Name":"Coral Light","Red":253,"Green":156,"Blue":151,"#RGB":"#FD9C97"},{"DMC":"351","Floss Name":"Coral","Red":233,"Green":106,"Blue":103,"#RGB":"#E96A67"},{"DMC":"350","Floss Name":"Coral Medium","Red":224,"Green":72,"Blue":72,"#RGB":"#E04848"},{"DMC":"349","Floss Name":"Coral Dark","Red":210,"Green":16,"Blue":53,"#RGB":"#D21035"},{"DMC":"817","Floss Name":"Coral Red Very Dark","Red":187,"Green":5,"Blue":31,"#RGB":"#BB051F"},{"DMC":"3708","Floss Name":"Melon Light","Red":255,"Green":203,"Blue":213,"#RGB":"#FFCBD5"},{"DMC":"3706","Floss Name":"Melon Medium","Red":255,"Green":173,"Blue":188,"#RGB":"#FFADBC"},{"DMC":"3705","Floss Name":"Melon Dark","Red":255,"Green":121,"Blue":146,"#RGB":"#FF7992"},{"DMC":"3801","Floss Name":"Melon Very Dark","Red":231,"Green":73,"Blue":103,"#RGB":"#E74967"},{"DMC":"666","Floss Name":"Bright Red","Red":227,"Green":29,"Blue":66,"#RGB":"#E31D42"},{"DMC":"321","Floss Name":"Red","Red":199,"Green":43,"Blue":59,"#RGB":"#C72B3B"},{"DMC":"304","Floss Name":"Red Medium","Red":183,"Green":31,"Blue":51,"#RGB":"#B71F33"},{"DMC":"498","Floss Name":"Red Dark","Red":167,"Green":19,"Blue":43,"#RGB":"#A7132B"},{"DMC":"816","Floss Name":"Garnet","Red":151,"Green":11,"Blue":35,"#RGB":"#970B23"},{"DMC":"815","Floss Name":"Garnet Medium","Red":135,"Green":7,"Blue":31,"#RGB":"#87071F"},{"DMC":"814","Floss Name":"Garnet Dark","Red":123,"Green":0,"Blue":27,"#RGB":"#7B001B"},{"DMC":"894","Floss Name":"Carnation Very Light","Red":255,"Green":178,"Blue":187,"#RGB":"#FFB2BB"}]


./src/data/options.json
-----------------------

.. code-block:: json
    :linenos:
    :name: options.json
    :caption: options.json

    {
        "maxZoom": 15,
        "minZoom": 0.15,
        "maxRedo": 10,
        "maxUndo": 25
    }



./src/lib/canvas/UndoRedoTool.ts
--------------------------------

.. code-block:: ts 
    :linenos:
    :name: UndoRedoTool.ts
    :caption: UndoRedoTool.ts

    import Paper from "paper";
    import eventBus from "../eventBus";
    import options from "../../data/options.json";
    import Container from "../stitch/Container";

    class UndoRedoTool {
        private static undoStack: paper.Layer[] = [];
        private static redoStack: paper.Layer[] = [];

        /**
        * @description grabs the 1st layer of the project and saves it to a stack
        * @returns {void}
        */
        public static addStateDefault() {
            if (Paper.project.layers.length === 0) return;

            UndoRedoTool.undoStack.push(
                Paper.project.layers[0].clone({ insert: false })
            );

            // since state changed, must clean redo stack
            UndoRedoTool.redoStack = [];

            UndoRedoTool.checkSize();

            UndoRedoTool.dispatchAvailability();
        }

        /**
        * @description gets the previous state saved in the undo stack
        */
        public static undo() {
            if (UndoRedoTool.undoStack.length > 0) {
                UndoRedoTool.redoStack.push(
                    Paper.project.layers[0].clone({ insert: false })
                );
                eventBus.dispatch("setCanvasLayer", UndoRedoTool.undoStack.pop());
            }

            UndoRedoTool.checkSize();

            UndoRedoTool.dispatchAvailability();
        }

        /**
        * @description gets the previous state saved in the redo stack
        */
        public static redo() {
            if (UndoRedoTool.redoStack.length > 0) {
                UndoRedoTool.undoStack.push(
                    Paper.project.layers[0].clone({ insert: false })
                );
                eventBus.dispatch("setCanvasLayer", UndoRedoTool.redoStack.pop());
            }

            UndoRedoTool.checkSize();
            UndoRedoTool.dispatchAvailability();
        }

        /**
        * @description checks and reduces the size of the stacks if they are getting too big
        */
        private static dispatchAvailability() {
            eventBus.dispatch("undoAvailable", UndoRedoTool.undoStack.length > 0);
            eventBus.dispatch("redoAvailable", UndoRedoTool.redoStack.length > 0);
        }

        /**
        * @description creates event listeners between multiple endpoints, this allows for seperate components to communicate
        */
        private static checkSize() {
            if (UndoRedoTool.undoStack.length > options.maxUndo)
                UndoRedoTool.undoStack.slice(
                    UndoRedoTool.undoStack.length - options.maxUndo
                );
            if (UndoRedoTool.redoStack.length > options.maxRedo)
                UndoRedoTool.redoStack.slice(
                    UndoRedoTool.redoStack.length - options.maxRedo
                );
        }
    }

    export default UndoRedoTool;



./src/lib/stitch/convert/fillPath.ts
------------------------------------

.. code-block:: ts 
    :linenos:
    :name: fillPath.ts
    :caption: fillPath.ts

    import Paper from "paper";

    import rowGutter from "./rowGutter";
    import itemToPathItem from "../../svg/itemToPathItem";
    import Graph from "../Graph";
    import straightSubdivision from "./straightSubdivision";
    import { getClosestPoint } from "../helpers";

    /**
    * @description generates a path of points to fill a shape without leaving any empty spaces
    * @param path path
    * @param stitchLength maximum length of the stitches
    * @param carryOnPoint point from which to start closest to
    * @param fillGutterSpacing space between gutters
    * @returns {Promise<paper.Point[][] | false>}
    */
    async function fillPath(
        path: paper.PathItem,
        stitchLength: number = 2.7,
        fillGutterSpacing: number = 1
    ): Promise<paper.Point[][] | false> {
        let tempPath: string = "";
        let tempItem;
        if (path.hasChildren()) tempItem = path.children[0];
        else tempItem = path;

        const tempPathItem = await itemToPathItem(tempItem);
        if (tempPathItem === undefined || tempPathItem?.pathData === undefined)
            return false;

        tempPath = tempPathItem.pathData;

        const directionVector = getDirectionVector(tempPath);

        const rows = rowGutter(path, fillGutterSpacing, directionVector);
        const flattenedCL = ([] as paper.CurveLocation[]).concat(...rows);

        let graph = new Graph(flattenedCL);

        // add gutter edges
        for (const row of rows) {
            for (let i = 0; i < row.length; i += 2) {
                graph.addEdge(row[i], row[i + 1]);
            }
        }

        // add outline edges
        let clByOutline: { [id: string]: paper.CurveLocation[] } = {};

        // categorise by path id
        for (const cl of flattenedCL) {
            if (Object.keys(clByOutline).includes(cl.curve.path.id.toString())) {
                clByOutline[cl.curve.path.id.toString()].push(cl);
            } else {
                clByOutline[cl.curve.path.id.toString()] = [cl];
            }
        }

        // sort all curve locations by the path offset
        for (const key of Object.keys(clByOutline)) {
            clByOutline[key].sort((a, b) => {
                const d1 =
                    a.path.getOffsetOf(a.point) ||
                    a.path.getOffsetOf(a.path.getNearestPoint(a.point));
                const d2 =
                    b.path.getOffsetOf(b.point) ||
                    b.path.getOffsetOf(b.path.getNearestPoint(b.point));

                if (d1 > d2) {
                    return 1;
                } else {
                    return -1;
                }
            });

            // add all the edges between the curve locations
            for (let i = 0; i < clByOutline[key].length; i++) {
                const e1: paper.CurveLocation = clByOutline[key][i];
                const e2: paper.CurveLocation =
                    clByOutline[key][(i + 1) % clByOutline[key].length];

                graph.addEdge(e1, e2);
                // add edge every other one to ensure all even vertices
                if (i % 2 === 1) graph.addEdge(e1, e2);
            }
        }

        let pointBlocks: paper.Point[][] = [];

        // get connected subgraphs
        let visitedIndexed: number[] = new Array(graph.adjacencyList.length);
        visitedIndexed.fill(0);
        let counter = 1;
        while (visitedIndexed.includes(0)) {
            const startIndex = visitedIndexed.indexOf(0);
            if (startIndex === -1) break;

            let curVisited: boolean[] = new Array(graph.adjacencyList.length);
            curVisited.fill(false);

            graph.recursionCheck(startIndex, curVisited);

            for (let i = 0; i < curVisited.length; i++) {
                if (curVisited[i]) {
                    visitedIndexed[i] = counter;
                }
            }

            counter++;
        }

        for (let i = 1; i < counter; i++) {
            let availableVertices: number[] = [];

            for (let j = 0; j < visitedIndexed.length; j++) {
                if (visitedIndexed[j] === i) availableVertices.push(j);
            }

            let startPoint = 0;

            // get point closest to last for smaller jump distances
            if (i > 1) {
                const potentialClosestPoint = getClosestPoint(
                    pointBlocks[pointBlocks.length - 1][
                        pointBlocks[pointBlocks.length - 1].length - 1
                    ],
                    graph.referenceTable
                        .filter((e, c) => availableVertices.includes(c))
                        .map((e) => e.point)
                );

                if (potentialClosestPoint !== null)
                    startPoint = potentialClosestPoint;
            }

            // generate path then create sub divisons to prevent stitch lengths being too far apart
            const result = graph.getEulorianPath(availableVertices[startPoint]);
            let buffer: paper.Point[] = [];

            if (result) {
                for (let i = 0; i < result.length - 1; i++) {
                    const divisons = straightSubdivision(
                        result[i].point,
                        result[i + 1].point,
                        stitchLength,
                        true
                    );
                    buffer.push(...divisons);
                }
                buffer.push(result[result.length - 1].point);
                pointBlocks.push(buffer);
            }
        }

        return pointBlocks;
    }

    /**
    * @description calculates the average normal across half of the shape
    * @param pathData path
    * @returns {paper.Point} the unit vector of the normal
    */
    function getDirectionVector(pathData: string): paper.Point {
        //already made sure the item cannot be a CompoundPath
        //@ts-ignore
        const path: paper.Path = Paper.Path.create(pathData);

        const precision = 1;
        const halfDistance = path.length / 2;
        let totalX = 0;
        let totalY = 0;

        for (let i = 0; i < Math.floor(halfDistance / precision) + 1; i++) {
            const point = path.getNormalAt(i * precision);
            totalX += point.x;
            totalY += point.y;
        }

        return new Paper.Point(
            totalX / Math.floor(halfDistance / precision),
            totalY / Math.floor(halfDistance / precision)
        );
    }

    export default fillPath;



./src/lib/stitch/convert/rowGutter.ts
---------------------------------------

.. code-block:: ts 
    :linenos:
    :name: rowGutter.ts
    :caption: rowGutter.ts

    import Paper from "paper";

    /**
    * @description slices through a path at given intervals ata given angle to generate points at which thread should go across a shape
    * @param {paper.Path} pathpath to check intersects at
    * @param {number} spacing spacing between gutters
    * @param {paper.Point} normal unit vector normal
    * @returns
    */
    function rowGutter(
        path: paper.PathItem,
        spacing: number = 0.5,
        normal: paper.Point
    ) {
        // Lines do not need to be created across the whole project, only the bounding box. The length of each line can be calculated, and how many extra line are needed below and above the bounding bow using the normal given. Lines need to overflow initially since rotating the shapes will leave empty space if that is not done
        const bounding = path.bounds;
        const hypotenuse = Math.sqrt(
            Math.pow(bounding.width, 2) + Math.pow(bounding.height, 2)
        );
        const offset = hypotenuse / 2;

        const lower = -Math.abs(
            Math.ceil(Math.sin(normal.angleInRadians) * hypotenuse)
        );
        const upper = Math.ceil(-lower + bounding.height);

        let lines: paper.Path[] = [];

        for (let y = 0; y < Math.ceil((upper - lower) / spacing) + 1; y++) {
            const pStart = new Paper.Point(
                bounding.bottomLeft.x - offset,
                bounding.bottomCenter.y - y * spacing - lower
            );
            const pEnd = new Paper.Point(
                bounding.bottomRight.x + offset,
                bounding.bottomCenter.y - y * spacing - lower
            );
            let tempLine = new Paper.Path.Line(pStart, pEnd);

            tempLine.rotate(normal.angle, bounding.center);
            lines.push(tempLine);
        }

        let gutterLines: paper.CurveLocation[][] = [];

        lines.forEach((line) => {
            let intersectPoints: paper.CurveLocation[] =
                path.getIntersections(line);

            const initialPoint = line.segments[0].point;

            // sort intersection points in order by how far away they are from the inital start point of the line
            intersectPoints.sort((a, b) => {
                if (
                    initialPoint.getDistance(a.point, false) >
                    initialPoint.getDistance(b.point, false)
                )
                    return 1;
                else if (
                    initialPoint.getDistance(a.point, false) <
                    initialPoint.getDistance(b.point, false)
                )
                    return -1;
                return 0;
            });

            if (intersectPoints.length <= 1) return;

            if (intersectPoints.length % 2 === 1) {
                delete intersectPoints[intersectPoints.length - 1];
            }

            gutterLines.push(intersectPoints);
        });

        return gutterLines;
    }

    export default rowGutter;



./src/lib/stitch/convert/runningPath.ts
-----------------------------------------

.. code-block:: ts 
    :linenos:
    :name: runningPath.ts
    :caption: runningPath.ts

    /**
    * @description generates a set of points along a given path, with each point a stitchLength units away
    * @param {paper.Path} path path that the stitches will go across
    * @param {number} stitchLength length between points
    * @param {boolean} [omitLast] exclude the last point or not
    * @returns {paper.Point[]} points at which stitches are made at
    */
    function runningPath(path: paper.Path, stitchLength: number): paper.Point[] {
        let buffer: paper.Point[] = [];
        const totalDistance: number = path.length;
        let anchorDistances: number[] = [];

        // get anchor points
        for (let i = 0; i < path.segments.length - 1; i++) {
            anchorDistances.push(path.getOffsetOf(path.segments[i].point));
        }

        for (let i = 0; i < Math.floor(totalDistance / stitchLength) + 1; i++) {
            const curDistance = stitchLength * i;
            //used a while loop just in case there are loads of anchors in a short space
            while (anchorDistances.length > 0 && curDistance > anchorDistances[0]) {
                // already checked if array is not empty with the length condition, idky typsecript did not catch it
                //@ts-ignore
                buffer.push(path.getPointAt(anchorDistances.shift()));
            }

            buffer.push(path.getPointAt(curDistance));
        }

        if (buffer.length > 2) {
            buffer.unshift(buffer[0], buffer[1], buffer[0], buffer[1]); // tie-in
        }

        console.log(anchorDistances);

        // if the last point in the array is not equal to the end point, add the end point
        if (buffer[buffer.length - 1] !== path.getPointAt(totalDistance)) {
            buffer.push(path.getPointAt(totalDistance));
        }

        if (buffer.length > 2) {
            buffer.push(
                buffer[buffer.length - 2],
                buffer[buffer.length - 1],
                buffer[buffer.length - 2],
                buffer[buffer.length - 1]
            ); // tie-out
        }

        return buffer;
    }

    export default runningPath;



./src/lib/stitch/convert/satinPath.ts
-------------------------------------

.. code-block:: ts 
    :linenos:
    :name: satinPath.ts
    :caption: satinPath.ts

    import straightSubdivision from "./straightSubdivision";
    import Paper from "paper";

    /**
    * @description generates a set of points that
    * @param {paper.Path} path path to check against
    * @param {number} width total width of the path
    * @param {number} stitchLength maximum length of a stitch in a satin stitch, a higher number is normally used because of the straightness
    * @param {number} spaceBetweenNormals distance at which the normals are calculated at
    * @returns {paper.Point[]} points at which stitches are made at
    */
    function satinPath(
        path: paper.Path,
        width: number,
        stitchLength: number = 10,
        spaceBetweenNormals: number = 1
    ): paper.Point[] {
        let preBuffer: [paper.Point, paper.Point, number][] = [];
        let buffer: paper.Point[] = [];

        for (
            let i = 0;
            i < Math.floor(path.length / spaceBetweenNormals) + 1;
            i++
        ) {
            let vector = path.getNormalAt(spaceBetweenNormals * i);
            // add bottom then top of the normal to make the up and down pattern
            preBuffer.push([
                path
                    .getPointAt(spaceBetweenNormals * i)
                    .add(vector.multiply(width / 2).multiply(-1)),
                path
                    .getPointAt(spaceBetweenNormals * i)
                    .add(vector.multiply(width / 2)),
                spaceBetweenNormals * i,
            ]);
        }

        let lastOffset = 0;

        for (let i = 0; i < preBuffer.length; i++) {
            const start = preBuffer[i][0];
            const end = preBuffer[i][1];

            // if (isInRanges(preBuffer[i][2], ranges)) {
            // 	let c = new Paper.Shape.Circle(start, 1);
            // 	c.fillColor = new Paper.Color("red");
            // }

            // add offset only if the distance is larger than the stitch length, increment offset to change it every normal
            if (start.getDistance(end, false) > Math.pow(stitchLength, 2)) {
                lastOffset = (lastOffset + 20) % 100;
            } else {
                lastOffset = 0;
            }

            straightSubdivision(
                start,
                end,
                stitchLength,
                false,
                lastOffset
            ).forEach((p) => buffer.push(p));
        }

        if (buffer.length > 2) {
            buffer.unshift(buffer[0], buffer[1], buffer[0], buffer[1]); // tie-in
        }

        if (buffer.length > 2) {
            buffer.push(
                buffer[buffer.length - 2],
                buffer[buffer.length - 1],
                buffer[buffer.length - 2],
                buffer[buffer.length - 1]
            ); // tie-off
        }

        return buffer;
    }

    export default satinPath;


    
./src/lib/stitch/convert/straightSubdivision.ts
-----------------------------------------------

.. code-block:: ts 
    :linenos:
    :name: straightSubdivision.ts
    :caption: straightSubdivision.ts

    import Paper from "paper";

    /**
    * @description generates intermediate points on a start line between 2 point given a maximum length between each point
    * @param {paper.Point} start start point of the stitch block
    * @param {paper.Point} end end point of the stitch block
    * @param {number} stitchLength maximum length between stitches
    * @param {boolean} omitLast remove last point or not
    * @param {number} [percentOffset] percentage offset in relation to the stitch length to add at the start of the block
    * @returns list of points that make up the straight line defined.
    */
    function straightSubdivision(
        start: paper.Point,
        end: paper.Point,
        stitchLength: number,
        omitLast: boolean = false,
        percentOffset: number = 0
    ): paper.Point[] {
        let buffer: paper.Point[] = [];
        let totalDistance = start.getDistance(end);

        // if total distance is less than or equal to stitch length, or the total distance is bigger than the percent offset ...
        if (
            totalDistance <= stitchLength &&
            (percentOffset % 100 === 0 ||
                totalDistance <= stitchLength * (percentOffset / 100))
        ) {
            if (omitLast) return [start];
            else return [start, end];
        }

        // offset the line if percentage offset is not a full offset
        if (percentOffset % 100 !== 0) {
            buffer.push(start);
            start = getPointDistanceAway(
                start,
                end,
                stitchLength * (percentOffset / 100)
            );
            totalDistance = start.getDistance(end);
        }

        for (let i = 0; i < Math.floor(totalDistance / stitchLength) + 1; i++) {
            buffer.push(getPointDistanceAway(start, end, stitchLength * i));
        }

        // if will not omit last, and the last point in the array is not equal to the end point, add the end point
        if (
            !omitLast &&
            buffer[buffer.length - 1].x !== end.x &&
            buffer[buffer.length - 1].y !== end.y
        )
            buffer.push(end);

        return buffer;
    }

    /**
    * @description gets the closest point from one to a set of others, returning the index in the list, or null is none are found
    * @param {paper.Point} start point to compare against
    * @param {paper.Point[]} points  list of available point to choose from
    * @returns {number | null} closest index
    */
    function getPointDistanceAway(
        start: paper.Point,
        end: paper.Point,
        distance: number
    ): paper.Point {
        const totalDistance = start.getDistance(end);

        if (totalDistance === 0 || distance === 0) return start;

        // https://math.stackexchange.com/a/2045181/553498
        return new Paper.Point(
            start.x + (distance / totalDistance) * (end.x - start.x),
            start.y + (distance / totalDistance) * (end.y - start.y)
        );
    }

    export default straightSubdivision;


./src/lib/stitch/Block.ts
-------------------------

.. code-block:: ts 
    :linenos:
    :name: Block.ts
    :caption: Block.ts

    /**
    * @description class that encapsulates a block of points, where a jump stitch is normally formed between blocks
    */
    class Block {
        public stitches: paper.Point[];
        public colour: paper.Color | null;

        public constructor(
            points: paper.Point[] = [],
            colour: paper.Color | null = null
        ) {
            this.stitches = points;
            this.colour = colour;
        }
    }

    export default Block;


./src/lib/stitch/Container.ts
-----------------------------

.. code-block:: ts 
    :linenos:
    :name: Container.ts
    :caption: Container.ts

    import Paper from "paper";

    import Block from "./Block";
    import { embroideryTypes } from "../../types/embroideryTypes.d";
    import getLeafItems from "../svg/getLeafItems";
    import runningPath from "./convert/runningPath";
    import satinPath from "./convert/satinPath";
    import itemToPathItem from "../svg/itemToPathItem";
    import straightSubdivision from "./convert/straightSubdivision";
    import FileSaver from "file-saver";
    import fillPath from "./convert/fillPath";
    import eventBus from "../eventBus";

    // NOTE: 1 unit on the canvas is 1mm, but since most embroider file types use an arbitrary unit of max 127 and min -127, the units will be divided by 10 to give an accuracy of 1/10mm for the embroidery file types, with a maximum of 12.7mm distance between jumps and stitches.

    class Container {
        public sequence: Block[] = [];

        /**
        * @description converts SVGs into stitch blocks
        * @param layer layer to convert
        * @returns {void}
        */
        public async convertToBlocks(layer: paper.Layer) {
            this.sequence = [];

            const leafItems: paper.Item[] = getLeafItems(layer);
            const stitchLength =
                parseFloat(window.localStorage.getItem("stitchLength") || "2.7") ||
                2.7;
            const spaceBetweenNormals =
                parseFloat(
                    window.localStorage.getItem("spaceBetweenNormals") || "1"
                ) || 1;
            const satinStitchLength =
                parseFloat(
                    window.localStorage.getItem("satinStitchLength") || "10"
                ) || 10;
            const fillGutterSpacing =
                parseFloat(
                    window.localStorage.getItem("fillGutterSpacing") || "1"
                ) || 1;

            for (const item of leafItems) {
                let strokeFlag = false;
                if (item.hasFill()) {
                    const pathItem = await itemToPathItem(item);
                    if (pathItem === undefined) continue;
                    try {
                        let result = await fillPath(
                            pathItem,
                            stitchLength,
                            fillGutterSpacing
                        );
                        if (result) {
                            for (const section of result) {
                                this.sequence.push(
                                    new Block(section, item.fillColor)
                                );
                            }
                        }
                    } catch (err) {
                        // shape probabily too small, just make the perimeter
                        strokeFlag = true;
                        console.log("error: " + err);
                    }
                }
                if (item.hasStroke() || strokeFlag) {
                    if (item.hasChildren()) {
                        let pathDatas: string[] = [];

                        for (const i of item.children) {
                            let result = (await itemToPathItem(i))?.pathData;
                            if (result === undefined) continue;
                            pathDatas.push(result);
                        }

                        pathDatas.forEach((path) => {
                            const result = this.strokeToBlock(
                                path,
                                item.strokeWidth,
                                stitchLength,
                                spaceBetweenNormals,
                                satinStitchLength,
                                item.strokeColor || new Paper.Color("black")
                            );

                            if (result.stitches.length > 4) {
                                this.sequence.push(result);
                            }
                        });
                    } else {
                        const pathData = (await itemToPathItem(item))?.pathData;
                        if (pathData === undefined) continue;

                        const result = this.strokeToBlock(
                            pathData,
                            item.strokeWidth,
                            stitchLength,
                            spaceBetweenNormals,
                            satinStitchLength,
                            item.strokeColor || new Paper.Color("black")
                        );

                        if (result.stitches.length > 4) {
                            this.sequence.push(result);
                        }
                    }
                }
            }

            this.sequenceSanitise();

            eventBus.dispatch("setCanvasLayer", this.convertToSVG());
        }

        /**
        * @description generates a path of the outline of path,
        * @param path path
        * @param width width of the stroke
        * @param stitchLength maximum stitch length
        * @param spaceBetweenNormals space between the normals of satin stitching
        * @param satinStitchLength maximum subsection length of satin stitches
        * @param colour colour of the block
        * @returns {Block} generated path
        */
        private strokeToBlock(
            path: string,
            width: number,
            stitchLength: number,
            spaceBetweenNormals: number,
            satinStitchLength: number,
            colour: paper.Color
        ): Block {
            if (width >= 2)
                return new Block(
                    satinPath(
                        new Paper.Path(path),
                        width,
                        satinStitchLength,
                        spaceBetweenNormals
                    ),
                    colour
                );
            else
                return new Block(
                    runningPath(new Paper.Path(path), stitchLength),
                    colour
                );
        }

        public convertToSVG(): paper.Layer | undefined {
            if (this.sequence.length === 0) return;
            let commands: [string, "solid" | "dashed", paper.Color][] = [];

            for (let i = 0; i < this.sequence.length; i++) {
                const block = this.sequence[i];
                let command = `M ${block.stitches[0].x.toFixed(
                    1
                )},${block.stitches[0].y.toFixed(1)}`;

                // create a jump stitch path from last point
                if (i > 0) {
                    commands.push([
                        `M ${this.sequence[i - 1].stitches[0].x.toFixed(
                            1
                        )},${this.sequence[i - 1].stitches[0].y.toFixed(
                            1
                        )} L ${block.stitches[0].x.toFixed(
                            1
                        )},${block.stitches[0].y.toFixed(1)}`,
                        "dashed",
                        block.colour || new Paper.Color("black"),
                    ]);
                }

                // creates straight line to next absolute stitch position
                for (let j = 1; j < block.stitches.length; j++) {
                    const S = block.stitches[j];
                    command += ` L ${S.x.toFixed(1)},${S.y.toFixed(1)}`;
                }

                commands.push([
                    command,
                    "solid",
                    block.colour || new Paper.Color("black"),
                ]);
            }

            let layer = new Paper.Layer({ insert: false });

            commands.forEach((command) => {
                let path = Paper.PathItem.create(command[0]);
                path.strokeColor = command[2];
                path.strokeCap = "round";
                path.strokeJoin = "round";
                path.strokeWidth = 0.27;
                if (command[1] === "dashed") {
                    path.dashArray = [2, 2];
                    path.opacity = 1;
                }
                layer.addChild(path);
            });

            eventBus.dispatch("setCanvasLayer", layer);
            return layer;
        }

        public convertToEmbroidery(type: embroideryTypes, filename: string) {
            if (this.sequence.length === 0) return;
            switch (type) {
                case embroideryTypes.exp:
                    this.convertToExp(filename.replace(" ", "_"));
                    break;

                default:
                    break;
            }
        }

        private convertToExp(filename: string) {
            let preBytes: ["stitch" | "jump" | "end" | "stop", number, number][] =
                [];
            let cP: paper.Point = this.sequence[0].stitches[0];

            for (let i = 0; i < this.sequence.length; i++) {
                const block = this.sequence[i];

                // change colour if the colours coming up are not the same
                if (i > 0 && this.sequence[i - 1].colour !== block.colour) {
                    preBytes.push(["stop", 0, 0]);
                }

                // jump to new block if points not the same
                if (cP !== block.stitches[0]) {
                    // prevent jumping too far (max 12.7mm)
                    const jumpPoints = straightSubdivision(
                        cP,
                        block.stitches[0],
                        12.7,
                        false
                    );

                    // ignore first point since starting from there
                    for (let j = 1; j < jumpPoints.length; j++) {
                        const nP = jumpPoints[j];
                        let dX = Math.trunc((nP.x - cP.x) * 10);
                        let dY = -Math.trunc((nP.y - cP.y) * 10);
                        preBytes.push(["jump", dX, dY]);
                        // adjust the new point with the difference in mind, this prevents offset
                        cP = new Paper.Point(cP.x + dX / 10, cP.y - dY / 10);
                    }
                }

                for (let s = 0; s < block.stitches.length; s++) {
                    const nP = block.stitches[s];
                    let dX = Math.trunc((nP.x - cP.x) * 10);
                    let dY = -Math.trunc((nP.y - cP.y) * 10);
                    preBytes.push(["stitch", dX, dY]);
                    // adjust the new point with the difference in mind, this prevents offset
                    cP = new Paper.Point(cP.x + dX / 10, cP.y - dY / 10);
                }
            }

            preBytes.push(["end", 0, 0]);

            // compute total byte size of the file. 2 bytes per control command, 2 per coordinates
            let length = 0;
            preBytes.forEach((command) => {
                if (command[0] === "end" || command[0] === "stitch") length += 2;
                else if (command[0] === "stop" || command[0] === "jump")
                    length += 4;
            });

            let bytes = new Int8Array(length);
            let counter = 0;

            // convert commands to bytes https://edutechwiki.unige.ch/en/Embroidery_format_EXP
            preBytes.forEach((command) => {
                switch (command[0]) {
                    case "stitch":
                        bytes.set([command[1], command[2]], counter);
                        counter += 2;
                        break;
                    case "end":
                        bytes.set([-128, -128], counter);
                        counter += 2;
                        break;
                    case "stop":
                        bytes.set([-128, 1, 0, 0], counter);
                        counter += 4;
                        break;
                    case "jump":
                        bytes.set([-128, 2, command[1], command[2]], counter);
                        counter += 4;
                        break;

                    default:
                        break;
                }
            });

            FileSaver(new Blob([bytes]), filename + ".exp");
        }

        private sequenceSanitise() {
            // sanitizes the sequence (removes blocks with <3 stitches, removes null points)
            this.sequence = this.sequence
                .filter((block) => block.stitches.length > 2)
                .map((block) => {
                    return new Block(
                        block.stitches.filter((stitch) => stitch !== null),
                        block.colour
                    );
                });
        }
    }

    export default Container;


./src/lib/stitch/Graph.ts
-------------------------

.. code-block:: ts 
    :linenos:
    :name: Graph.ts
    :caption: Graph.ts

    class Graph {
        public referenceTable: paper.CurveLocation[] = [];
        public adjacencyList: number[][];

        constructor(curveLocations: paper.CurveLocation[]) {
            this.adjacencyList = new Array(curveLocations.length);
            this.referenceTable = curveLocations;
            for (let i = 0; i < curveLocations.length; i++) {
                this.adjacencyList[i] = [];
            }
        }

        /**
        *
        * @param cl1 vertex 1
        * @param cl2 vertex 2
        * @param sufficient whether the path finding algorithm will stop once all of the sufficient edges have been visited
        * @returns {boolean} if the edge has been added
        */
        public addEdge(
            cl1: paper.CurveLocation,
            cl2: paper.CurveLocation
        ): boolean {
            if (cl1 === cl2) return false;

            const index1 = this.referenceTable.findIndex((value) => {
                if (value.point === cl1.point) return true;
                return false;
            });
            const index2 = this.referenceTable.findIndex((value) => {
                if (value.point === cl2.point) return true;
                return false;
            });

            if (index1 === -1 || index2 === -1) return false;

            this.adjacencyList[index1].push(index2);
            this.adjacencyList[index2].push(index1);
            return true;
        }

        /**
        * @description helper function for the isConnected() function
        * @param {number} i vertex to check
        * @param {boolean[]} visited vertex visited status
        */
        public recursionCheck(
            i: number,
            visited: boolean[],
            adj: number[][] = this.adjacencyList
        ) {
            visited[i] = true;

            for (let node of adj[i]) {
                if (!visited[node]) this.recursionCheck(node, visited);
            }
        }

        /**
        * @description hierholzer's algorithm to find the an eulorian path, with a sufficiency of the edges between the intersections
        * @param {number} startingVertex vertex index to start from
        * @returns {number[]} path to take
        */
        public getEulorianPath(startingVertex = 0): paper.CurveLocation[] | false {
            let curVertex = startingVertex;

            let cPath: number[] = [];
            let ePath: number[] = [];

            cPath.push(curVertex);

            while (cPath.length > 0) {
                const u = cPath[cPath.length - 1];

                // all edges are visited
                if (this.adjacencyList[u].length === 0) {
                    ePath.push(u);
                    cPath.pop();
                } else {
                    cPath.push(this.adjacencyList[u][0]);
                    const index1 = u;
                    const index2 = this.adjacencyList[u][0];
                    this.removeEdge(index1, index2);
                }
            }

            return ePath.map((e) => this.referenceTable[e]);
        }

        private removeEdge(
            u: number,
            v: number,
            adj: number[][] = this.adjacencyList
        ) {
            if (adj[u].includes(v)) adj[u].splice(adj[u].indexOf(v), 1);
            if (adj[v].includes(u)) adj[v].splice(adj[v].indexOf(u), 1);
        }
    }

    export default Graph;


./src/lib/stitch/helpers.ts
---------------------------

.. code-block:: ts 
    :linenos:
    :name: helpers.ts
    :caption: helpers.ts

    function getClosestPoint(
        start: paper.Point,
        points: paper.Point[]
    ): number | null {
        if (points.length === 0) {
            return null;
        }

        let smallestDistance = Number.MAX_VALUE;
        let lastIndex = -1;

        for (let i = 0; i < points.length; i++) {
            const val = start.getDistance(points[i], false);
            if (smallestDistance > val) {
                lastIndex = i;
                smallestDistance = val;
            }
        }

        return lastIndex;
    }

    export { getClosestPoint };


./src/lib/svg/copyStyling.ts
----------------------------

.. code-block:: ts 
    :linenos:
    :name: copyStyling.ts
    :caption: copyStyling.ts

    /**
    * @description copies the styling of one item to another, or from its parent. Returns the item
    * @param {paper.Item} reciever item that will recieve the styling
    * @param {paper.Item | null} giver item that will give the styling, if left out, will get the first parent that has valid styling
    * @returns {paper.Item} reciever with the new styling
    */
    function copyStyling(reciever: paper.Item, giver: paper.Item | null = null) {
        if (reciever.hasFill() || reciever.hasStroke()) {
            return reciever;
        } else if (giver === null && hasParent(reciever)) {
            giver = reciever.parent;
            while (!(giver.hasFill() || giver.hasStroke())) {
                if (hasParent(giver)) giver = giver.parent;
                else return;
            }
            copyStyles(reciever, giver);
        } else if (giver !== null) {
            copyStyles(reciever, giver);
        }

        return reciever;
    }

    function copyStyles(reciever: paper.Item, giver: paper.Item) {
        reciever.strokeCap = giver.strokeCap;
        reciever.strokeColor = giver.strokeColor;
        reciever.strokeJoin = giver.strokeJoin;
        reciever.strokeScaling = giver.strokeScaling;
        reciever.strokeWidth = giver.strokeWidth;
        reciever.fillColor = giver.fillColor;
        reciever.fillRule = giver.fillRule;
    }

    function hasParent(item: paper.Item) {
        return item.parent !== null;
    }

    export default copyStyling;


./src/lib/svg/getLeafItems.ts
-----------------------------

.. code-block:: ts 
    :linenos:
    :name: getLeafItems.ts
    :caption: getLeafItems.ts

    import Paper from "paper";
    import copyStyling from "./copyStyling";

    /**
    * @description get all items which have no children, and have at least a stroke or fill (this prevents selecting empty groups)
    * @param layer layer to get all of the items out of, if left empty, uses the project window
    * @returns {paper.Item[]} list fo leaf items
    */
    function getLeafItems(layer: paper.Layer | null = null): paper.Item[] {
        try {
            if (layer === null) layer = Paper.project.layers[0];

            let items = layer
                .getItems({})
                .filter((item) => {
                    // remove all items with children apart from compound paths
                    if (
                        (item.hasChildren() &&
                            item.constructor.name !== "CompoundPath") ||
                        (!item.hasStroke() && !item.hasFill())
                    )
                        return false;
                    return true;
                })
                .map((item: paper.Item) => {
                    // reapply styling if it has no styling
                    copyStyling(item);
                    return item;
                });

            // remove items that have their parents still in the array (paths of compound paths)
            items = items.filter((item) => {
                if (items.includes(item.parent)) return false;
                return true;
            });

            // remove very small shapes
            items = items.filter((e) => {
                if (e.hasChildren()) return true;

                //@ts-ignore
                const item: paper.Path = e;
                if (item.closed && !item.hasStroke() && Math.abs(item.area) < 5)
                    return false;
                return true;
            });

            return items;
        } catch {
            return [];
        }
    }

    export default getLeafItems;


./src/lib/svg/itemToPathItem.ts
-------------------------------

.. code-block:: ts 
    :linenos:
    :name: itemToPathItem.ts
    :caption: itemToPathItem.ts

    import Paper from "paper";
    import { parse } from "svgson";

    import copyStyling from "./copyStyling";
    const toPath = require("element-to-path");

    /**
    * @description converts any item into a pathItem if it can be
    * @param {paper.Item} item item to convert
    * @returns {Promise<paper.Path | paper.PathItem | paper.CompoundPath | undefined>}
    */
    async function itemToPathItem(
        item: paper.Item
    ): Promise<paper.Path | paper.PathItem | paper.CompoundPath | undefined> {
        if (!isValidShape) return undefined;

        // copies styling to add it back after conversion
        const temp = copyStyling(item, item);

        //@ts-ignore
        let svg: SVGPathElement = item.exportSVG();

        // parse any type of svg shape to path, normalises it
        const json = await parse("<svg>" + svg.outerHTML + "</svg>");

        let path = toPath(json.children[0]);

        if (!path) return undefined;

        let pItem = Paper.PathItem.create(path);

        pItem.position = item.position;

        copyStyling(pItem, temp);

        return pItem;
    }

    /**
    * @description checks if the Item given can be visually described in SVG (this excludes groups and the such)
    * @param item item to check
    * @returns {boolean}
    */
    function isValidShape(item: paper.Item): boolean {
        //@ts-ignore
        let svg: SVGPathElement = item.exportSVG();

        if (
            ![
                "rect",
                "circle",
                "ellipse",
                "line",
                "polyline",
                "polygon",
                "path",
            ].includes(svg.tagName)
        )
            return false;
        return true;
    }

    export default itemToPathItem;


./src/lib/svg/normaliseColours.ts
---------------------------------

.. code-block:: ts 
    :linenos:
    :name: normaliseColours.ts
    :caption: normaliseColours.ts

    import Paper from "paper";
    import DMCColours from "../../data/DMCColours.json";
    import { Color } from "paper/dist/paper-core";
    import { DMCColour } from "../../types/DMCColour";

    /**
    * @description gets the closest DMC colour available given its colour
    * @param elem element to change the style of
    * @param stroke change stroke?
    * @param fill change fill?
    * @returns {void}
    */
    function normaliseColours(
        elem?: paper.Item,
        stroke: boolean = true,
        fill: boolean = true
    ): void {
        if (elem) {
            if (fill && elem.fillColor) {
                elem.fillColor = new Paper.Color(
                    getClosestColour(elem.fillColor)["#RGB"]
                );
            }
            if (stroke && elem.strokeColor)
                elem.strokeColor = new Paper.Color(
                    getClosestColour(elem.strokeColor)["#RGB"]
                );
        } else {
            Paper.project.getItems({}).forEach((item) => {
                if (fill && item.fillColor)
                    item.fillColor = new Paper.Color(
                        getClosestColour(item.fillColor)["#RGB"]
                    );
                if (stroke && item.strokeColor)
                    item.strokeColor = new Paper.Color(
                        getClosestColour(item.strokeColor)["#RGB"]
                    );
            });
        }
    }

    /**
    * @description returns the closest colour available from the DMC thread list
    * @param {paper.Color} c colour to compare against
    * @returns {paper.Color} result
    */
    function getClosestColour(c: paper.Color) {
        let smallestValue: number = 9999;
        let closestColour: any = null;

        DMCColours.forEach((e) => {
            let value = getValueHSB(e, c);

            if (value < smallestValue) {
                smallestValue = value;
                closestColour = e;
            }
        });

        return closestColour;
    }

    /**
    * @description compares two colours using the HSB colour model, and gets a relative value of closeness
    * @param {DMCColour} e DMC colour
    * @param {paper.Color} c other colour
    * @returns {number} relative value
    */
    function getValueHSB(e: DMCColour, c: paper.Color) {
        // if the brightness is very low, hue does not matter, vice versa. This multiple will reflect this
        const brightnessMultiple =
            c.brightness < 0.05 ? 100 : -2.5 * c.brightness + 4;

        const c1 = new Color(e["#RGB"]);
        const dHue = c.hue - c1.hue;
        const dSaturation = c.saturation - c1.saturation;
        const dBrightness = c.brightness - c1.brightness;

        // get distance between colours
        // since saturation and brightness go from 0 to 1, I needed to normalise them to 0 to 360, the range that the Hue takes. Since humans precieve brightness better than colour, I gave brightness a slightly higher bias than saturation. I added a higher bias to hue than the rest since changing the hue is quite noticable
        let value = Math.sqrt(
            Math.pow(dHue * 3.5, 2) +
                Math.pow(dSaturation * 360 * 1.3, 2) +
                Math.pow(dBrightness * 360 * brightnessMultiple, 2)
        );

        return value;
    }

    export default normaliseColours;


./src/lib/svg/removeOverlap.ts
------------------------------

.. code-block:: ts 
    :linenos:
    :name: removeOverlap.ts
    :caption: removeOverlap.ts

    import Paper from "paper";

    import UndoRedoTool from "../canvas/UndoRedoTool";
    import eventBus from "../eventBus";
    import getLeafItems from "./getLeafItems";
    import itemToPathItem from "./itemToPathItem";

    /**
    * @description removes overlapping sections which are not displayed, this prevents stitches being too thick
    * @returns {Promise<paper.Layer>}
    */
    async function removeOverlaps(): Promise<paper.Layer> {
        UndoRedoTool.addStateDefault();

        let array: (paper.Item | paper.PathItem)[] = getLeafItems();
        let newArray: paper.PathItem[] = [];

        // goes through all items, from bottom to top, and subtracts all the items above it. All the items are first converted to PathItems to allow for svg boolean algebra
        for (let i = 0; i < array.length; i++) {
            let parent = await itemToPathItem(array[i]);

            if (parent === undefined) continue;

            for (let j = i + 1; j < array.length; j++) {
                // we do not want to remove paths without fills, since they could part of the design
                if (!array[j].hasFill()) continue;

                // if paths do not intersect and are not inside eachother, continue
                if (
                    !(
                        array[j].isInside(array[i].bounds) ||
                        array[j].intersects(array[i])
                    )
                )
                    continue;

                let child = await itemToPathItem(array[j]);

                if (child === undefined) continue;

                parent = parent.subtract(child, { insert: false });
            }

            newArray.push(parent);
        }

        // add all new elements to a layer and dispatch it to be added to the project
        let l = new Paper.Layer();

        l.addChildren(newArray);

        eventBus.dispatch("setCanvasLayer", l);

        return l;
    }

    export default removeOverlaps;


./src/lib/eventBus.ts
---------------------

.. code-block:: ts 
    :linenos:
    :name: eventBus.ts
    :caption: eventBus.ts

    const eventBus = {
        on(event: any, callback: any) {
            document.addEventListener(event, (e) => callback(e.detail));
        },

        dispatch(event: any, data: any) {
            document.dispatchEvent(new CustomEvent(event, { detail: data }));
        },

        remove(event: any, callback: any) {
            document.removeEventListener(event, callback);
        },
    };

    export default eventBus;


./src/styles/App.css
--------------------

.. code-block:: css 
    :linenos:
    :name: App.css
    :caption: App.css

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    * *:focus {
        @apply outline-none outline-hidden outline-0;
    }

./src/types/DMCColour.d.ts
--------------------------

.. code-block:: ts 
    :linenos:
    :name: DMCColour.d.ts
    :caption: DMCColour.d.ts

    export interface DMCColour {
        DMC: string;
        "Floss Name": string;
        Red?: number;
        Green?: number;
        Blue?: number;
        "#RGB": string;
    }


./src/types/embroideryTypes.d.ts
--------------------------------

.. code-block:: ts 
    :linenos:
    :name: embroideryTypes.d.ts
    :caption: embroideryTypes.d.ts

    export enum embroideryTypes {
        "exp",
    }


./src/App.tsx
-------------

.. code-block:: tsx 
    :linenos:
    :name: App.tsx
    :caption: App.tsx

    import { useEffect, useState } from "react";
    import "./styles/App.css";
    import useResizeObserver from "use-resize-observer";

    import Toolbar from "./components/toolbar/Toolbar";
    import Sidebar from "./components/sidebar/Sidebar";
    import Canvas from "./components/canvas/Canvas";
    import UndoRedoTool from "./lib/canvas/UndoRedoTool";
    import eventBus from "./lib/eventBus";
    import Modal from "./components/modal/Modal";

    // TODO: add msg if screen is too small

    function App() {
        const { ref, width = 1000, height = 1000 } = useResizeObserver();
        const [showModal, setShowModal] = useState(false);

        useEffect(() => {
            if (width < 800 || height < 650) {
                setShowModal(true);
            } else {
                setShowModal(false);
            }
        }, [width, height]);

        function listener(ev: KeyboardEvent) {
            // keyboard shortcuts
            if (ev.ctrlKey && ev.key === "z") {
                ev.preventDefault();
                UndoRedoTool.undo();
            } else if (ev.ctrlKey && ev.key === "Z") {
                ev.preventDefault();
                UndoRedoTool.redo();
            } else if (ev.shiftKey && ev.key === "+") {
                ev.preventDefault();
                eventBus.dispatch("zoom", "in");
            } else if (ev.shiftKey && ev.key === "_") {
                ev.preventDefault();
                eventBus.dispatch("zoom", "out");
            } else if (ev.ctrlKey && ev.key === "o") {
                ev.preventDefault();
                eventBus.dispatch("resetView", {});
            }
        }

        useEffect(() => {
            window.addEventListener("keydown", listener);

            return window.removeEventListener("keydown", listener);
        }, []);

        return (
            <div ref={ref}>
                <main className="max-w-screen bg-repeating-pattern flex h-screen flex-col items-center justify-start overflow-x-hidden overflow-y-clip bg-stone-200">
                    <Toolbar></Toolbar>
                    <div className="bg-repeating-pattern flex h-full w-full flex-row justify-between ">
                        <div className="shadow-inset flex h-full w-full items-center justify-center shadow-md">
                            <div className=" h-[calc(100%-20px)] w-[calc(100%-20px)]  bg-white">
                                <Canvas></Canvas>
                            </div>
                        </div>
                        <Sidebar />
                    </div>
                </main>
                <Modal
                    isOpen={showModal}
                    setOpen={setShowModal}
                    title={"WARNING"}
                    description={
                        "Using this website with a small screen may result in a bad experience"
                    }
                ></Modal>
            </div>
        );
    }

    export default App;


./src/index.css
---------------

.. code-block:: css 
    :linenos:
    :name: index.css
    :caption: index.css

    body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    }

    code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
    }


./src/index.tsx
---------------

.. code-block:: tsx
    :linenos:
    :name: index.tsx
    :caption: index.tsx

    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import App from './App';
    import reportWebVitals from './reportWebVitals';

    ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
    );


./src/react-app-env.d.ts
------------------------

.. code-block:: ts 
    :linenos:
    :name: react-app-env.d.ts
    :caption: react-app-env.d.ts

    /// <reference types="react-scripts" />

./package.json
--------------

.. code-block:: json
    :linenos:
    :name: package.json
    :caption: package.json

    {
        "name": "easythread",
        "version": "0.1.0",
        "private": true,
        "dependencies": {
            "@headlessui/react": "^1.4.3",
            "@heroicons/react": "^1.0.5",
            "@koale/useworker": "^4.0.2",
            "@popperjs/core": "^2.11.2",
            "@scena/react-ruler": "^0.9.1",
            "@tailwindcss/typography": "^0.5.1",
            "@testing-library/jest-dom": "^5.16.1",
            "@testing-library/react": "^12.1.2",
            "@testing-library/user-event": "^13.5.0",
            "@types/jest": "^27.4.0",
            "@types/node": "^16.11.21",
            "@types/react": "^17.0.38",
            "@types/react-dom": "^17.0.11",
            "@types/underscore": "^1.11.4",
            "core-js": "^3.20.3",
            "dsa.js": "^2.7.6",
            "element-to-path": "^1.2.1",
            "file-saver": "^2.0.5",
            "paper": "^0.12.15",
            "path-data-polyfill": "^1.0.3",
            "path-that-svg": "^1.2.4",
            "react": "^17.0.2",
            "react-app-polyfill": "^3.0.0",
            "react-dom": "^17.0.2",
            "react-popper": "^2.2.5",
            "react-scripts": "5.0.0",
            "react-storage-hooks": "^4.0.1",
            "react-usestateref": "^1.0.8",
            "svgson": "^5.2.1",
            "typescript": "^4.5.5",
            "use-resize-observer": "^8.0.0",
            "web-vitals": "^2.1.4"
        },
        "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "eject": "react-scripts eject"
        },
        "eslintConfig": {
            "extends": [
                "react-app",
                "react-app/jest"
            ]
        },
        "browserslist": {
            "production": [
                ">0.2%",
                "not dead",
                "not op_mini all"
            ],
            "development": [
                "last 1 chrome version",
                "last 1 firefox version",
                "last 1 safari version"
            ]
        },
        "devDependencies": {
            "@types/file-saver": "^2.0.5",
            "autoprefixer": "^10.4.2",
            "postcss": "^8.4.5",
            "prettier": "^2.5.1",
            "prettier-plugin-tailwindcss": "^0.1.5",
            "tailwindcss": "^3.0.18"
        }
    }



./postcss.config.js
-------------------------------

.. code-block:: js 
    :linenos:
    :name: postcss.config.js
    :caption: postcss.config.js

    module.exports = {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    }



./tailwind.config.js
-------------------------------

.. code-block:: js 
    :linenos:
    :name: tailwind.config.js
    :caption: tailwind.config.js

    module.exports = {
        content: ["./src/**/*.{js,jsx,ts,tsx}"],
        theme: {
            fontFamily: {
                sans: ["Lato", "sans-serif"],
                serif: ["Merriweather", "serif"],
                mono: ["Roboto mono", "mono"],
            },
            extend: {
                backgroundImage: {
                    "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
                    "gradient-conic-t":
                        "conic-gradient(at top, var(--tw-gradient-stops))",
                    "gradient-conic-r":
                        "conic-gradient(at right, var(--tw-gradient-stops))",
                    "gradient-conic-b":
                        "conic-gradient(at bottom, var(--tw-gradient-stops))",
                    "gradient-conic-l":
                        "conic-gradient(at left, var(--tw-gradient-stops))",
                    "gradient-conic-tr":
                        "conic-gradient(at top right, var(--tw-gradient-stops))",
                    "gradient-conic-tl":
                        "conic-gradient(at top left, var(--tw-gradient-stops))",
                    "gradient-conic-br":
                        "conic-gradient(at bottom right, var(--tw-gradient-stops))",
                    "gradient-conic-bl":
                        "conic-gradient(at bottom left, var(--tw-gradient-stops))",

                    "repeating-pattern":
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%23b3ada9' fill-opacity='0.2'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E\")",
                },
                screens: { xs: "475px" },
                colors: {
                    cobalt: {
                        50: "#3279dd",
                        100: "#286fd3",
                        200: "#1e65c9",
                        300: "#145bbf",
                        400: "#0a51b5",
                        500: "#0047ab",
                        600: "#003da1",
                        700: "#003397",
                        800: "#00298d",
                        900: "#001f83",
                    },
                    primary: "#3279dd", // cobalt-50

                    // indicators
                    ok: "#16A34A", // green-600
                    info: "#0284C7", //cyan-600
                    warning: "#D97706", // amber-600
                    danger: "#DC2626", // red-600
                },
            },
        },
        plugins: [require("@tailwindcss/typography")],
    };



./tsconfig.json
-------------------------------

.. code-block:: json 
    :linenos:
    :name: tsconfig.json
    :caption: tsconfig.json

    {
        "compilerOptions": {
            "target": "es5",
            "lib": [
            "dom",
            "dom.iterable",
            "esnext"
            ],
            "allowJs": true,
            "skipLibCheck": true,
            "esModuleInterop": true,
            "allowSyntheticDefaultImports": true,
            "strict": true,
            "forceConsistentCasingInFileNames": true,
            "noFallthroughCasesInSwitch": true,
            "module": "esnext",
            "moduleResolution": "node",
            "resolveJsonModule": true,
            "isolatedModules": true,
            "noEmit": true,
            "jsx": "react-jsx"
        },
        "include": [
            "src"
        ]
    }
