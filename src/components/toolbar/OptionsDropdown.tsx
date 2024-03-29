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
	const [fillStitchLength, setFillStitchLength] = useStorageState<string>(
		localStorage,
		"fillStitchLength",
		"4"
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
	useEffect(() => {
		window.localStorage.setItem("fillStitchLength", fillStitchLength);
	}, [fillStitchLength]);

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
				<div className="flex w-[250px] flex-row items-center justify-start p-1">
					<p className="mr-2">Fill stitch length</p>
					<NumberInput
						className="mx-0.5 max-w-[70px] !px-0.5 !py-0"
						setValue={setFillStitchLength}
						value={fillStitchLength}
					></NumberInput>
					<p>mm</p>
				</div>
			</div>
		</Dropdown>
	);
};

export default OptionsDropdown;
