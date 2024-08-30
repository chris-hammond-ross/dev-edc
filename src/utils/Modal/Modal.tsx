import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Tabs from "../Tabs/Tabs";
import "./Modal.css";

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	size?: "small" | "medium" | "large";
	type?: "default" | "confirm" | "alert" | "settings";
	theme?: "success" | "error" | "warning" | "info" | "default";
	title?: string;
	autoClose?: number;
	footerActionLabel?: string;
	onFooterAction?: () => void;
	tabs?: { id: string; label: string; content: React.ReactNode }[];
};

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	children,
	size = "medium",
	type = "default",
	theme = "default",
	title,
	autoClose,
	footerActionLabel,
	onFooterAction,
	tabs,
}) => {
	const [isClosing, setIsClosing] = useState<boolean>(false);
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		if (isOpen && !isMounted) {
			setIsMounted(true);
			setIsClosing(false);
		} else if (!isOpen && isMounted) {
			setIsClosing(true);
			const timer = setTimeout(() => {
				setIsMounted(false);
			}, 300); // This should match the CSS animation duration
			return () => clearTimeout(timer);
		}
	}, [isOpen, isMounted]);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isOpen && autoClose) {
			timer = setTimeout(() => {
				handleClose();
			}, autoClose * 1000);
		}
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [isOpen, autoClose]);

	const handleClose = (): void => {
		setIsClosing(true);
		setTimeout(() => {
			onClose();
		}, 300); // This should match the CSS animation duration
	};

	if (!isMounted) return null;

	const modalClass = `modal-content modal-${size} modal-${type} modal-${theme} ${isClosing ? "closing" : ""}`;
	const showOverlay = type !== "alert";

	return (
		<>
			{showOverlay && (
				<div
					className={`modal-overlay ${isClosing ? "closing" : ""}`}
					onClick={handleClose}
				/>
			)}
			<div className={modalClass}>
				{title && (
					<>
						<div className="modal-header">
							<h2>{title}</h2>
							<button
								onClick={handleClose}
								className="close-button"
								aria-label="Close"
							>
								<X size={24} />
							</button>
						</div>
						<div className="modal-body">
							<div className="modal-content-wrapper">
								{tabs ? <Tabs tabs={tabs} /> : children}
							</div>
						</div>
						{footerActionLabel && onFooterAction && (
							<div className="modal-footer">
								<button
									onClick={onFooterAction}
									className="footer-action-button"
								>
									{footerActionLabel}
								</button>
							</div>
						)}
					</>
				)}
				{!title && (
					<div className="modal-headless">
						<div className="modal-body">{children}</div>
						<button
							onClick={handleClose}
							className="close-button floating-close"
							aria-label="Close"
						>
							<X size={24} />
						</button>
					</div>
				)}
			</div>
		</>
	);
};

export default Modal;
