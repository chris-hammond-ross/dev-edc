// TODO: this needs work
import React, { useState, useEffect } from "react";
import { Modal, ModalProps } from "../../utils";
import "./CodeMinifierPrettifier.css";

import {
	html as htmlBeautify,
	css as cssBeautify,
	js as jsBeautify,
} from "js-beautify";
import { minify as jsMinify } from "terser";

const CodeMinifierPrettifier: React.FC = () => {
	const [input, setInput] = useState<string>("");
	const [output, setOutput] = useState<string>("");
	const [language, setLanguage] = useState<string>("html");
	const [operation, setOperation] = useState<string>("minify");
	const [indentSize, setIndentSize] = useState<number>(2);
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	useEffect(() => {
		processCode();
	}, [input, language, operation, indentSize]);

	const minifyHTML = (html: string): string => {
		return html
			.replace(/\s+/g, " ")
			.replace(/>\s+</g, "><")
			.replace(/<!--[\s\S]*?-->/g, "")
			.trim();
	};

	const minifyCSS = (css: string): string => {
		return css
			.replace(/\s+/g, " ")
			.replace(/;\s+/g, ";")
			.replace(/:\s+/g, ":")
			.replace(/{\s+/g, "{")
			.replace(/}\s+/g, "}")
			.replace(/,\s+/g, ",")
			.replace(/\/\*[\s\S]*?\*\//g, "")
			.trim();
	};

	const escapeHTML = (str: string): string => {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	};

	const highlightHTML = (code: string): string => {
		return escapeHTML(code)
			.replace(
				/(&lt;\/?[a-z][^&]*?&gt;)/gi,
				'<span class="tag">$1</span>',
			)
			.replace(/(&lt;!--.*?--&gt;)/g, '<span class="comment">$1</span>')
			.replace(/(".*?")/g, '<span class="string">$1</span>');
	};

	const highlightCSS = (code: string): string => {
		return escapeHTML(code)
			.replace(/([a-z-]+)(?=:)/g, '<span class="property">$1</span>')
			.replace(/(:\s*)(.*?)(;|\})/g, '$1<span class="value">$2</span>$3')
			.replace(/(@\w+)/g, '<span class="at-rule">$1</span>')
			.replace(/(#[a-f0-9]{3,6})/gi, '<span class="color">$1</span>')
			.replace(
				/(\d+(%|px|em|rem|vh|vw))/g,
				'<span class="unit">$1</span>',
			)
			.replace(/(\{|\})/g, '<span class="bracket">$1</span>');
	};

	const highlightJS = (code: string): string => {
		return escapeHTML(code)
			.replace(
				/\b(var|let|const|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|typeof|instanceof)\b/g,
				'<span class="keyword">$1</span>',
			)
			.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="string">$1</span>')
			.replace(/(\d+)/g, '<span class="number">$1</span>')
			.replace(/(\{|\}|\(|\)|\[|\])/g, '<span class="bracket">$1</span>')
			.replace(/(\/\/.*)/g, '<span class="comment">$1</span>')
			.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
	};

	const processCode = async (): Promise<void> => {
		if (!input) {
			setOutput("");
			return;
		}

		try {
			let result: string = "";
			if (operation === "minify") {
				switch (language) {
					case "html":
						result = minifyHTML(input);
						break;
					case "css":
						result = minifyCSS(input);
						break;
					case "javascript": {
						const minifiedJs = await jsMinify(input);
						if (minifiedJs.code !== undefined) {
							result = minifiedJs.code;
						} else {
							throw new Error(
								"Minification failed: No code returned",
							);
						}
						break;
					}
				}
			} else {
				const options = { indent_size: indentSize };
				switch (language) {
					case "html":
						result = htmlBeautify(input, options);
						break;
					case "css":
						result = cssBeautify(input, options);
						break;
					case "javascript":
						result = jsBeautify(input, options);
						break;
				}
			}

			// Apply syntax highlighting
			switch (language) {
				case "html":
					result = highlightHTML(result);
					break;
				case "css":
					result = highlightCSS(result);
					break;
				case "javascript":
					result = highlightJS(result); // escapeHTML(result);
					break;
			}

			setOutput(result);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setOutput(`Error: ${error.message}`);
			} else {
				setOutput("An unknown error occurred");
			}
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		setInput(e.target.value);
	};

	const copyToClipboard = (text: string): void => {
		navigator.clipboard
			.writeText(text.replace(/<[^>]+>/g, ""))
			.then(() => {
				setAlertMessage("Copied to clipboard!");
				setAlertTheme("success");
				setIsAlertModalOpen(true);
			})
			.catch(() => {
				setAlertMessage(
					"Failed to copy. Please try selecting and copying manually.",
				);
				setAlertTheme("error");
				setIsAlertModalOpen(true);
			});
	};

	return (
		<>
			<div className="toolbar">
				<h2>HTML/CSS/JavaScript Minifier and Prettifier</h2>
				<div className="toolbar-button-container">
					<select
						value={language}
						onChange={(e) => setLanguage(e.target.value)}
					>
						<option value="html">HTML</option>
						<option value="css">CSS</option>
						<option value="javascript">JavaScript</option>
					</select>
					<select
						value={operation}
						onChange={(e) => setOperation(e.target.value)}
					>
						<option value="minify">Minify</option>
						<option value="prettify">Prettify</option>
					</select>
					{operation === "prettify" && (
						<select
							value={indentSize}
							onChange={(e) =>
								setIndentSize(Number(e.target.value))
							}
						>
							<option value="2">2 spaces</option>
							<option value="4">4 spaces</option>
							<option value="8">8 spaces</option>
						</select>
					)}
				</div>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						value={input}
						onChange={handleInputChange}
						placeholder={`Enter ${language.toUpperCase()} code`}
					/>
					<button onClick={() => copyToClipboard(input)}>
						Copy Input
					</button>
				</div>
				<div className="output-container">
					{input ? (
						<pre
							dangerouslySetInnerHTML={{ __html: output }}
							className="output-pre minify"
						/>
					) : (
						<div className="faux-output">
							<div className="faux-placeholder">
								Output will appear here
							</div>
						</div>
					)}
					<button onClick={() => copyToClipboard(output)}>
						Copy Output
					</button>
				</div>
			</div>
			<Modal
				isOpen={isAlertModalOpen}
				onClose={() => setIsAlertModalOpen(false)}
				type="alert"
				theme={alertTheme}
				autoClose={1}
			>
				{alertMessage}
			</Modal>
		</>
	);
};

export default CodeMinifierPrettifier;
