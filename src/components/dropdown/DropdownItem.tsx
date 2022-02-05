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
