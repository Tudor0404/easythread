import React from "react";

interface Props {
	hex: string;
	onMouseLeave: React.MouseEventHandler<HTMLDivElement>;
	onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
	onClick: React.MouseEventHandler<HTMLDivElement>;
}

const ColourBox: React.FC<Props> = (props) => {
	return (
		<div
			className="h-6 w-6 border-2 border-black/20"
			style={{ background: props.hex }}
			onClick={props.onClick}
			onMouseEnter={props.onMouseEnter}
			onMouseLeave={props.onMouseLeave}
		>
			{" "}
		</div>
	);
};

export default ColourBox;
