import React, { useState } from "react";

interface Props {
	value: any;
	setValue: any;
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
