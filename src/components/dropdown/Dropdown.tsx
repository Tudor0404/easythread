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
										: `bg-black bg-opacity-0 hover:bg-opacity-10 text-black disabled:text-gray-600
			rounded-md
						p-1
            mx-0.5
			ease-in-out
			text-center
			transition-all duration-200 flex justify-center items-center outline-none focus:outline-none border-0`
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
								className={` absolute ${
									props.align === "right"
										? "right-0 origin-top-right"
										: "left-0 origin-top-left"
								} mt-2  rounded-md shadow-lg justify-start items-start ring-2 ring-black/5 bg-white ${
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
