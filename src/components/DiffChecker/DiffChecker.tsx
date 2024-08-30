// TODO: when the right hand side textarea is taller than the left
// the scrollbar only scrolls to the height of the left
// not allowing the user to scroll all the way to the bottom
import React, { useState, useRef, useEffect } from "react";
import { diffChars, Change } from "diff";
import "./DiffChecker.css";

interface DiffPart extends Change {
	added?: boolean;
	removed?: boolean;
	value: string;
}

const DiffChecker: React.FC = () => {
	const [leftText, setLeftText] = useState<string>("");
	const [rightText, setRightText] = useState<string>("");
	const [diff, setDiff] = useState<DiffPart[]>([]);
	const leftTextareaRef = useRef<HTMLTextAreaElement>(null);
	const rightTextareaRef = useRef<HTMLTextAreaElement>(null);
	const highlightLayerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const differences = diffChars(leftText, rightText);
		setDiff(differences);
	}, [leftText, rightText]);

	const handleLeftChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		setLeftText(e.target.value);
	};

	const handleRightChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		setRightText(e.target.value);
	};

	const renderDiff = () => {
		return diff.map((part, index) => {
			const className = part.added
				? "added"
				: part.removed
					? "removed"
					: "unchanged";
			return (
				<span key={index} className={className}>
					{part.value}
				</span>
			);
		});
	};

	const handleScroll = (
		e: React.UIEvent<HTMLTextAreaElement>,
		otherRef: React.RefObject<HTMLTextAreaElement>,
		highlightRef?: React.RefObject<HTMLDivElement>,
	): void => {
		const target = e.target as HTMLTextAreaElement;
		const { scrollTop, scrollHeight, clientHeight } = target;

		const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
		const otherElement = otherRef.current;

		if (otherElement) {
			const newScrollTop =
				scrollPercentage *
				(otherElement.scrollHeight - otherElement.clientHeight);
			otherElement.scrollTop = newScrollTop;

			if (highlightRef && highlightRef.current) {
				highlightRef.current.scrollTop = newScrollTop;
			}
		}
	};

	return (
		<>
			<div className="toolbar">
				<h2>Diff Checker</h2>
			</div>
			<div className="component-container">
				<div className="input-wrapper">
					<textarea
						spellCheck={false}
						ref={leftTextareaRef}
						value={leftText}
						onChange={handleLeftChange}
						onScroll={(e) => handleScroll(e, rightTextareaRef)}
						placeholder="Enter original text"
					/>
				</div>
				<div
					className={`input-wrapper ${rightText ? "highlighted" : ""}`}
				>
					<textarea
						spellCheck={false}
						ref={rightTextareaRef}
						value={rightText}
						onChange={handleRightChange}
						onScroll={(e) =>
							handleScroll(e, leftTextareaRef, highlightLayerRef)
						}
						placeholder="Enter modified text"
					/>
					{rightText && (
						<div
							ref={highlightLayerRef}
							className="highlight-layer"
						>
							{renderDiff()}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default DiffChecker;
