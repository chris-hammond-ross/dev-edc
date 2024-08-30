import React, { useState, useEffect, useRef } from "react";
import yaml from "js-yaml";
import Papa, { UnparseObject } from "papaparse";
import { Modal, ModalProps } from "../../utils";
import "./DataConverter.css";

type DataFormat = "json" | "yaml" | "csv";

const DataConverter: React.FC = () => {
	const [inputText, setInputText] = useState<string>("");
	const [inputFormat, setInputFormat] = useState<DataFormat>("json");
	const [outputFormats, setOutputFormats] = useState<{
		json: string;
		yaml: string;
		csv: string;
	}>({ json: "", yaml: "", csv: "" });
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (inputText) {
			const detectedFormat = detectFormat(inputText);
			setInputFormat(detectedFormat);
			convertData(inputText, detectedFormat);
		}
	}, [inputText]);

	const detectFormat = (input: string): DataFormat => {
		input = input.trim();
		if (input.startsWith("{") || input.startsWith("[")) {
			return "json";
		} else if (input.includes(",") && !input.includes(":")) {
			return "csv";
		} else {
			return "yaml";
		}
	};

	const convertData = (data: string, format: DataFormat): void => {
		try {
			let parsedData: unknown;

			// Parse input data
			switch (format) {
				case "json":
					parsedData = JSON.parse(data);
					break;
				case "yaml":
					parsedData = yaml.load(data);
					break;
				case "csv":
					parsedData = Papa.parse(data, {
						header: true,
						skipEmptyLines: true,
					}).data;
					break;
			}

			// Convert to all formats
			setOutputFormats({
				json: JSON.stringify(parsedData, null, 2),
				yaml: yaml.dump(parsedData),
				csv: Papa.unparse(parsedData as UnparseObject<unknown>),
			});
		} catch (error) {
			console.error("Error converting data:", error);
			setAlertMessage("Error converting data. Please check your input.");
			setAlertTheme("error");
			setIsAlertModalOpen(true);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		setInputText(e.target.value);
	};

	const handleFormatChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	): void => {
		const newFormat = e.target.value as DataFormat;
		setInputFormat(newFormat);
		if (inputText) {
			convertData(inputText, newFormat);
		}
	};

	const syntaxHighlight = (text: string, format: DataFormat): string => {
		switch (format) {
			case "json":
				return highlightJSON(text);
			case "yaml":
				return highlightYAML(text);
			case "csv":
				return highlightCSV(text);
			default:
				return text;
		}
	};

	const highlightJSON = (json: string): string => {
		json = json
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		return json.replace(
			/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
			(match) => {
				let cls = "json-number";
				if (/^"/.test(match)) {
					if (/:$/.test(match)) {
						cls = "json-key";
					} else {
						cls = "json-string";
					}
				} else if (/true|false/.test(match)) {
					cls = "json-boolean";
				} else if (/null/.test(match)) {
					cls = "json-null";
				}
				return `<span class="${cls}">${match}</span>`;
			},
		);
	};

	const highlightYAML = (yaml: string): string => {
		return yaml
			.replace(/(^|\n)([^:\n]+):/g, '$1<span class="yaml-key">$2</span>:')
			.replace(/: (.+)$/gm, ': <span class="yaml-value">$1</span>')
			.replace(
				/(^|\n)(-|\s*-)\s/g,
				'$1<span class="yaml-list">$2 </span>',
			);
	};

	const highlightCSV = (csv: string): string => {
		const lines = csv.split("\n");
		return lines
			.map((line, index) => {
				if (index === 0) {
					return `<span class="csv-header">${line}</span>`;
				}
				return line
					.split(",")
					.map((cell) => `<span class="csv-cell">${cell}</span>`)
					.join(",");
			})
			.join("\n");
	};

	// TODO: idea to paste into textarea by simply clicking the right mouse button (like in a shell)
	// but requires use to give permission from an alert, maybe not worth it
	/*const pasteFromClipboard = (
		event: React.MouseEvent<HTMLTextAreaElement>,
	): void => {
		event.preventDefault();
		navigator.clipboard
			.readText()
			.then((clipboardText) => {
				const textarea = inputRef.current;
				if (textarea) {
					const start = textarea.selectionStart;
					const end = textarea.selectionEnd;
					const currentText = textarea.value;
					const newText =
						currentText.slice(0, start) +
						clipboardText +
						currentText.slice(end);
					setInputText(newText);

					// Set cursor position after pasted text
					setTimeout(() => {
						textarea.selectionStart = textarea.selectionEnd =
							start + clipboardText.length;
					}, 0);
				}
			})
			.catch((err) =>
				console.error("Failed to read clipboard contents: ", err),
			);
	};*/

	const clearInput = (): void => {
		setInputText("");
		setOutputFormats({
			json: "",
			yaml: "",
			csv: "",
		});
	};

	const copyToClipboard = (text: string): void => {
		navigator.clipboard
			.writeText(text)
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
				<h2>
					Data Converter - JSON &lt;&gt; YAML &lt;&gt; CSV &lt;&gt;
					JSON
				</h2>
				<div className="toolbar-button-container">
					<select value={inputFormat} onChange={handleFormatChange}>
						<option value="json">JSON</option>
						<option value="yaml">YAML</option>
						<option value="csv">CSV</option>
					</select>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container data-converter-input-container">
					<textarea
						spellCheck={false}
						ref={inputRef}
						value={inputText}
						onChange={handleInputChange}
						/*onContextMenu={pasteFromClipboard}*/
						placeholder={`Enter ${inputFormat.toUpperCase()} data`}
					/>
					<div className="button-container">
						<button onClick={() => clearInput()}>Clear</button>
					</div>
				</div>
				<div className="output-container data-converter-output-container">
					{(["json", "yaml", "csv"] as DataFormat[]).map(
						(format) =>
							format !== inputFormat && (
								<div key={format} className="output-segment">
									<h3>{format.toUpperCase()}</h3>
									{inputText ? (
										<pre
											dangerouslySetInnerHTML={{
												__html: syntaxHighlight(
													outputFormats[format],
													format,
												),
											}}
											className={`output-pre ${format}-output-pre`}
										/>
									) : (
										<div className="faux-output">
											<div className="faux-placeholder">
												{format.toUpperCase()} will
												appear here
											</div>
										</div>
									)}
									<button
										onClick={() =>
											copyToClipboard(
												outputFormats[format],
											)
										}
										disabled={!outputFormats[format]}
									>
										Copy
									</button>
								</div>
							),
					)}
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

export default DataConverter;
