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
