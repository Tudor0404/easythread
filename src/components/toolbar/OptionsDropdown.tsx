import React from "react";
import { CogIcon } from "@heroicons/react/outline";

import Switch from "../input/Switch";
import Dropdown from "../dropdown/Dropdown";
import NumberInput from "../input/NumberInput";

interface Props {
	isConvertToEmbroidery: boolean;
	setConvertToEmbroidery: React.Dispatch<React.SetStateAction<boolean>>;
	isRemoveOverlap: boolean;
	setRemoveOverlap: React.Dispatch<React.SetStateAction<boolean>>;
	isAverageOutColours: boolean;
	setAverageOutColours: React.Dispatch<React.SetStateAction<boolean>>;
	stitchLength: string;
	setStitchLength: React.Dispatch<React.SetStateAction<string>>;
	spaceBetweenNormals: string;
	setSpaceBetweenNormals: React.Dispatch<React.SetStateAction<string>>;
	satinStitchLength: string;
	setSatinStitchLength: React.Dispatch<React.SetStateAction<string>>;
}

const OptionsDropdown: React.FC<Props> = (props) => {
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
						setValue={props.setStitchLength}
						value={props.stitchLength}
					></NumberInput>
					<p>mm</p>
				</div>
				<div className="flex w-[250px] flex-row items-center justify-start p-1">
					<p className="mr-2">Satin spacing</p>
					<NumberInput
						className="mx-0.5 max-w-[70px] !px-0.5 !py-0"
						setValue={props.setSpaceBetweenNormals}
						value={props.spaceBetweenNormals}
					></NumberInput>
					<p>mm</p>
				</div>
				<div className="flex w-[250px] flex-row items-center justify-start p-1">
					<p className="mr-2">Satin stitch length</p>
					<NumberInput
						className="mx-0.5 max-w-[70px] !px-0.5 !py-0"
						setValue={props.setSatinStitchLength}
						value={props.satinStitchLength}
					></NumberInput>
					<p>mm</p>
				</div>
			</div>
		</Dropdown>
	);
};

export default OptionsDropdown;
