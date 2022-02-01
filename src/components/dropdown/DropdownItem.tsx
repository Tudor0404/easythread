import React from "react";
import { Menu } from "@headlessui/react";

interface Props {
	label: string;
	icon?: React.ComponentProps<"svg">;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const DropdownItem: React.FC<Props> = (props) => {
	return (
		<Menu.Item>
			{({ active }) => (
				<button
					className={`${
						active ? "bg-black/20" : ""
					} text-gray-900 rounded-md group flex items-center w-full px-2 py-2`}
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
