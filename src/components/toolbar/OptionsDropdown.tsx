import React from "react";
import { CogIcon } from "@heroicons/react/outline";
import Switch from "../input/Switch";
import Dropdown from "../dropdown/Dropdown";

import useState from "react-usestateref";
import TextInput from "../input/TextInput";
import NumberInput from "../input/NumberInput";

interface Props {}

const OptionsDropdown: React.FC<Props> = () => {
	const [isConvertToEmbroidery, setConvertToEmbroidery] = useState(true);
	const [isRemoveOverlap, setRemoveOverlap] = useState(true);
	const [isAverageOutColours, setAverageOutColours] = useState(true);
	const [stitchLength, setStitchLength] = useState("2.7");

	return (
		<Dropdown
			button={<CogIcon className="h-5 w-5 " stroke="inherit" />}
			align="right"
			tooltip="conversion settings"
		>
			<div className="flex flex-col justify-start items-start">
				<div className="py-1 flex flex-row w-[250px] items-center">
					<Switch
						active={isConvertToEmbroidery}
						setActive={setConvertToEmbroidery}
					/>
					<p
						className="col-span-4 flex-nowrap mt-0.5 select-none"
						onClick={() =>
							setConvertToEmbroidery(!isConvertToEmbroidery)
						}
					>
						Convert SVG to embroidery
					</p>
				</div>
				<div className="py-1 flex flex-row w-[250px] items-center">
					<Switch
						active={isRemoveOverlap}
						setActive={setRemoveOverlap}
					/>
					<p
						className="col-span-4 flex-nowrap mt-0.5 select-none"
						onClick={() => setRemoveOverlap(!isRemoveOverlap)}
					>
						Remove overlapping paths
					</p>
				</div>
				<div className="py-1 flex flex-row w-[250px] items-center">
					<Switch
						active={isAverageOutColours}
						setActive={setAverageOutColours}
					/>
					<p
						className="col-span-4 flex-nowrap mt-0.5 select-none"
						onClick={() =>
							setAverageOutColours(!isAverageOutColours)
						}
					>
						Average colours to DMC
					</p>
				</div>
				<div className="p-1 flex flex-row w-[250px] justify-start items-center">
					<p className="mr-2">Stitch length</p>
					<NumberInput
						className="max-w-[70px] !px-0.5 !py-0 mx-0.5"
						setValue={setStitchLength}
						value={stitchLength}
					></NumberInput>
					<p>mm</p>
				</div>
			</div>
		</Dropdown>
	);
};

export default OptionsDropdown;
