import React from "react";

interface Props {
	value: string;
	setValue: any;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	onKeyUp?: any;
}

const NumberInput: React.FC<Props> = (props) => {
	return (
		<div>
			<input
				disabled={props.disabled}
				value={props.value}
				onChange={(e) => {
					props.setValue(e.target.value);
				}}
				placeholder={props.placeholder}
				className={` focus:border-primary box-border w-auto border-2 border-slate-300 border-opacity-100 px-0.5 py-0 font-mono outline-none transition-all duration-200 hover:border-opacity-100 focus:border-opacity-100 focus:outline-none disabled:bg-slate-200 disabled:text-slate-400 ${props.className}`}
				onKeyPress={(e) => {
					if (
						// regex to only allow digits, one decimal point, no negative sign
						(/[0-9]*\.[0-9]*/.test(props.value) && e.key === ".") ||
						!/[0-9]|\./.test(e.key)
					) {
						e.preventDefault();
					}
				}}
				onKeyUp={props.onKeyUp}
			></input>
		</div>
	);
};

export default NumberInput;
