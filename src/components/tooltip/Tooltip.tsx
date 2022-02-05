import React, { useEffect, useState } from "react";

interface Props {
	isHover: boolean;
	setHover: React.Dispatch<React.SetStateAction<boolean>>;
	hoverRef: any;
	label: string;
	setPopperElement: React.Dispatch<React.SetStateAction<null>>;
	popperAttributes:
		| {
				[key: string]: string;
		  }
		| undefined;
	popperStyles: React.CSSProperties;
}

const Tooltip: React.FC<Props> = (props) => {
	const [isShown, setShown] = useState(false);

	useEffect(() => {
		setShown(false);
		setTimeout(() => {
			if (props.hoverRef.current) setShown(true);
			else setShown(false);
		}, 1000);
	}, [props.isHover]);

	return isShown ? (
		<div
			className="mt-2 rounded-md bg-gray-600 p-1 text-sm text-white"
			/*@ts-ignore*/
			ref={props.setPopperElement}
			style={props.popperStyles}
			{...props.popperAttributes}
		>
			{props.label}
		</div>
	) : null;
};

export default Tooltip;
