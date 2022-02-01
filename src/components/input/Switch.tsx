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
          relative inline-flex flex-shrink-0 h-[18px] w-[34px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 mx-1 `}
		>
			<span
				aria-hidden="true"
				className={`${props.active ? "translate-x-4" : "translate-x-0"}
            pointer-events-none inline-block h-[14px] w-[14px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
			/>
		</HeadlessSwitch>
	);
};

export default Switch;
