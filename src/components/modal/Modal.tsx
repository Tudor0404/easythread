import React, { useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../button/Button";

interface Props {
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	title?: string | null;
	description?: string | null;
	preventAutoClose?: boolean;
}

const Modal: React.FC<Props> = (props) => {
	return (
		<Transition
			show={props.isOpen}
			enter="transition duration-100 ease-out"
			enterFrom="transform scale-95 opacity-0"
			enterTo="transform scale-100 opacity-100"
			leave="transition duration-75 ease-out"
			leaveFrom="transform scale-100 opacity-100"
			leaveTo="transform scale-95 opacity-0"
		>
			<Dialog
				className="fixed inset-0 z-10 flex min-h-screen min-w-full items-center justify-center overflow-y-auto"
				open={props.isOpen}
				onClose={() => {
					if (!props.preventAutoClose) props.setOpen(false);
				}}
			>
				<Dialog.Overlay className="fixed inset-0 bg-black opacity-5" />
				<div className="z-40 flex min-h-[200px] min-w-[300px] flex-col items-center justify-between gap-4 rounded-md bg-white bg-opacity-100 p-3 shadow-lg outline-black/30">
					<div>
						{props.title && (
							<Dialog.Title className="place-self-start text-xl">
								{props.title}
							</Dialog.Title>
						)}
					</div>
					<div className="flex flex-grow flex-col items-center justify-center">
						{props.description && (
							<Dialog.Description>
								This will permanently deactivate your account
							</Dialog.Description>
						)}

						{props.children}

						{!props.preventAutoClose && (
							<Button
								onClick={() => props.setOpen(false)}
								filled
								className="place-self-end"
							>
								Cancel
							</Button>
						)}
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default Modal;
