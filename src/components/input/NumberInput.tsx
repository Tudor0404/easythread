import React from "react";

interface Props {
	value: string;
	setValue: any;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
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
				className={` border-2 border-opacity-100 outline-none border-slate-300 font-mono px-0.5 py-0 hover:border-opacity-100 focus:outline-none focus:border-opacity-100 focus:border-primary transition-all duration-200 w-auto box-border disabled:bg-slate-200 disabled:text-slate-400 ${props.className}`}
				type={"number"}
				onKeyPress={(e) => {
					if (!/[0-9]/.test(e.key) && e.key !== ".")
						e.preventDefault();

					if (/.*(.).*/.test(props.value) && e.key === ".")
						e.preventDefault();
				}}
			></input>
		</div>
	);
};

export default NumberInput;
