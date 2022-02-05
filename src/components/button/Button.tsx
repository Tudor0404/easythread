import React from "react";
import { usePopper } from "react-popper";
import useState from "react-usestateref";
import Tooltip from "../tooltip/Tooltip";

interface Props {
	children?: any;
	onClick?: any;
	filled?: boolean;
	className?: string;
	toggled?: boolean;
	tooltip?: string;
	disabled?: boolean;
}

const Button: React.FC<Props> = (props) => {
	const [referenceElement, setReferenceElement] = useState(null);
	const [popperElement, setPopperElement] = useState(null);
	const [isHover, setHover, hoverRef] = useState<boolean>(false);
	const { styles, attributes } = usePopper(referenceElement, popperElement);

	return (
		<>
			<button
				onClick={props.onClick}
				//@ts-ignore
				ref={setReferenceElement}
				disabled={props.disabled}
				className={`
			${
				props.filled
					? `bg-primary mx-2 bg-opacity-100 py-1 text-white hover:bg-opacity-90 ${
							props.toggled ? "bg-opacity-90" : ""
					  }`
					: `bg-black bg-opacity-0 text-black hover:bg-opacity-10 ${
							props.toggled ? "bg-opacity-10" : ""
					  }`
			}
			rounded-md
			px-1.5
			text-center
			transition-all
			duration-200
			ease-in-out disabled:!bg-opacity-0 
			disabled:!stroke-gray-400
			disabled:text-gray-600
			disabled:hover:!bg-opacity-0
			${props.className}
		`}
				onMouseEnter={() => {
					setHover(true);
				}}
				onMouseLeave={() => {
					setHover(false);
				}}
			>
				<p className="m-0 p-0">{props.children}</p>
			</button>
			{props.tooltip && (
				<Tooltip
					isHover={isHover}
					hoverRef={hoverRef}
					label={props.tooltip}
					popperAttributes={attributes.popper}
					popperStyles={styles.popper}
					setHover={setHover}
					setPopperElement={setPopperElement}
				/>
			)}
		</>
	);
};

export default Button;
