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
				className={` border-b-2 border-opacity-0 outline-none border-slate-300 p-1 pb-0 hover:border-opacity-100 focus:outline-none focus:border-opacity-100 focus:border-b-primary transition-all duration-200 w-auto box-border disabled:bg-slate-200 disabled:text-slate-400 ${props.className}`}
				type={props.type}
			></input>
		</div>
	);
};

export default TextInput;
