// TODO: enums don't seem to work
// and when trying to type out "enum" it auto completes to "email"
import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalProps } from "../../utils";
import "./QuickJSONGenerator.css";

type DataType =
	| "string"
	| "date"
	| "time"
	| "number"
	| "float"
	| "bool"
	| "guid"
	| "email"
	| "url"
	| "phone"
	| "color"
	| "ip"
	| "enum";

interface DataTypes {
	[key: string]: DataType | string;
}

interface Property {
	key: string;
	type: DataType | "object" | "array";
	count?: number;
	items?: Property[];
	properties?: Property[];
}

interface ParsedInput {
	count: number;
	properties: Property[];
}

const exampleInput = `[5{
  .id(guid)
  .username(string)
  .email(email)
  .isActive(bool)
  .registrationDate(date)
  .lastLogin(time)
  .age(number)
  .height(float)
  .phoneNumber(phone)
  .website(url)
  .favoriteColor(color)
  .ipAddress(ip)
  .status(enum:online,offline,away)
  .roles[](enum:user,admin,moderator)
  .tags[3](string)
  .profile{
	.bio(string)
	.avatarUrl(url)
	.socialMedia[2{
	  .platform(enum:twitter,facebook,instagram,linkedin)
	  .handle(string)
	}
  }
  .preferences{
	.theme(enum:light,dark,auto)
	.notifications(bool)
	.language(enum:en,es,fr,de,zh)
  }
  .stats{
	.postsCount(number)
	.followersCount(number)
	.followingCount(number)`;

const QuickJSONGenerator: React.FC = () => {
	const [input, setInput] = useState<string>("");
	const [output, setOutput] = useState<string>("");
	const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const highlightRef = useRef<HTMLPreElement>(null);

	const dataTypes: DataTypes = {
		s: "string",
		d: "date",
		t: "time",
		n: "number",
		f: "float",
		b: "bool",
		g: "guid",
		e: "email",
		u: "url",
		p: "phone",
		c: "color",
		i: "ip",
		enum: "enum:",
	};

	useEffect(() => {
		console.log("Input changed, updating highlight and output");
		updateHighlight();
		updateOutput();
	}, [input]);

	const parseInput = (input: string): ParsedInput => {
		const result: ParsedInput = { count: 1, properties: [] };
		const arrayMatch = input.match(/\[(\d+)/);
		if (arrayMatch) result.count = parseInt(arrayMatch[1]);

		function parseProperties(str: string): Property[] {
			const props: Property[] = [];
			const regex = /\.(\w+)(?:\[(\d+))?(?:\((\w+)\))?(\{)?/g;
			let match;
			let nestedStr = "";
			let nestedCount = 0;
			while ((match = regex.exec(str)) !== null) {
				const [_, key, arrayCount, type, openBracket] = match;
				console.log(_);
				if (openBracket) {
					nestedCount = 1;
					nestedStr = "";
					let i = regex.lastIndex;
					while (nestedCount > 0 && i < str.length) {
						if (str[i] === "{") nestedCount++;
						if (str[i] === "}") nestedCount--;
						if (nestedCount > 0) nestedStr += str[i];
						i++;
					}
					if (arrayCount) {
						props.push({
							key,
							type: "array",
							count: parseInt(arrayCount),
							items: parseProperties(nestedStr),
						});
					} else {
						props.push({
							key,
							type: "object",
							properties: parseProperties(nestedStr),
						});
					}
					regex.lastIndex = i;
				} else {
					props.push({ key, type: (type as DataType) || "string" });
				}
			}
			return props;
		}
		result.properties = parseProperties(input);
		return result;
	};

	const generateDummyData = (input: string): string => {
		console.log("Generating dummy data for input:", input);
		const parsedInput = parseInput(input);

		function generateObject(
			properties: Property[],
		): Record<string, unknown> {
			const obj: Record<string, unknown> = {};
			for (const prop of properties) {
				if (prop.type === "object") {
					obj[prop.key] = generateObject(prop.properties || []);
				} else if (prop.type === "array") {
					obj[prop.key] = Array(prop.count)
						.fill(null)
						.map(() => generateObject(prop.items || []));
				} else {
					obj[prop.key] = generateRandomValue(prop.type);
				}
			}
			return obj;
		}

		const result = [];
		for (let i = 0; i < parsedInput.count; i++) {
			result.push(generateObject(parsedInput.properties));
		}

		console.log("Generated dummy data:", result);
		return JSON.stringify(result, null, 2);
	};

	const generateRandomValue = (type: string): unknown => {
		switch (type) {
			case "string": {
				const loremIpsum =
					"lorem ipsum dolor sit amet consectetur adipiscing elit".split(
						" ",
					);
				return loremIpsum[
					Math.floor(Math.random() * loremIpsum.length)
				];
			}

			case "date": {
				const start = new Date(2000, 0, 1).getTime();
				const end = new Date().getTime();
				const randomDate = new Date(
					start + Math.random() * (end - start),
				);
				return randomDate.toISOString().split("T")[0];
			}

			case "time": {
				const now = new Date();
				now.setSeconds(Math.floor(Math.random() * 86400)); // Random time in a day
				return now.toISOString();
			}

			case "bool":
				return Math.random() < 0.5;
			case "number":
				return Math.floor(Math.random() * 1000);
			case "float":
				return Math.random() * 1000;
			case "guid":
				return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
					/[xy]/g,
					function (c) {
						const r = (Math.random() * 16) | 0,
							v = c == "x" ? r : (r & 0x3) | 0x8;
						return v.toString(16);
					},
				);
			case "email":
				return `user${Math.floor(Math.random() * 1000)}@example.com`;
			case "url":
				return `https://www.example${Math.floor(Math.random() * 100)}.com`;
			case "phone":
				return `+1-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 10000)}`.replace(
					/\b(\d{1})\b/g,
					"0$1",
				);
			case "color":
				return `#${Math.floor(Math.random() * 16777215)
					.toString(16)
					.padStart(6, "0")}`;
			case "ip":
				return Array(4)
					.fill(0)
					.map(() => Math.floor(Math.random() * 256))
					.join(".");
			case "enum":
				/*return enumValues[
					Math.floor(Math.random() * enumValues.length)
				];*/
				return "enum values"; // TODO: need to work on this
			default:
				return `Unsupported type: ${type}`;
		}
	};

	const syntaxHighlight = (json: string): string => {
		json = json
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		return json.replace(
			/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
			function (match) {
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
				return '<span class="' + cls + '">' + match + "</span>";
			},
		);
	};

	const highlightInput = (input: string): string => {
		return input.replace(
			/(\.\w+)|\b(\d+)\b|\[|\]|\{|\}|\(|\)|(\w+(?=\())/g,
			(match, property, number, type) => {
				if (property)
					return `<span class="hl-property">${property}</span>`;
				if (number) return `<span class="hl-number">${number}</span>`;
				if (type) return `<span class="hl-type">${type}</span>`;
				return `<span class="hl-bracket">${match}</span>`;
			},
		);
	};

	const updateHighlight = (): void => {
		console.log("Updating highlight");
		const highlighted = highlightInput(input);
		if (highlightRef.current) {
			highlightRef.current.innerHTML = highlighted + "\n";
		}
	};

	const updateOutput = (): void => {
		console.log("Updating output");
		try {
			const dummyData = generateDummyData(input);
			const highlighted = syntaxHighlight(dummyData);
			setOutput(highlighted);
			console.log("Output updated:", highlighted);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setOutput("Error: " + error.message);
			} else {
				setOutput("An unknown error occurred");
			}
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		const cursorPosition = e.target.selectionStart;
		const textBeforeCursor = e.target.value.substring(0, cursorPosition);
		const textAfterCursor = e.target.value.substring(cursorPosition);

		let newValue = e.target.value;
		let newCursorPosition = cursorPosition;

		// Auto-close brackets and place cursor inside
		if (
			e.nativeEvent instanceof InputEvent &&
			e.nativeEvent.inputType === "insertText" &&
			e.nativeEvent.data === "("
		) {
			newValue = textBeforeCursor + ")" + textAfterCursor;
			newCursorPosition = cursorPosition; // Keep cursor inside brackets
		}
		// Autocomplete data types and place cursor after closing bracket
		else if (
			e.nativeEvent instanceof InputEvent &&
			e.nativeEvent.inputType === "insertText" &&
			textBeforeCursor.match(/\([a-z]$/i)
		) {
			const char = textBeforeCursor.slice(-1).toLowerCase();
			if (Object.prototype.hasOwnProperty.call(dataTypes, char)) {
				const completion = dataTypes[char];
				newValue =
					textBeforeCursor.slice(0, -1) +
					completion +
					")" +
					textAfterCursor.slice(1);
				newCursorPosition = cursorPosition - 1 + completion.length + 1; // Place cursor after closing bracket
			}
		} else {
			newValue = e.target.value;
			newCursorPosition = cursorPosition;
		}

		setInput(newValue);

		// Use setTimeout to ensure the DOM has updated before we try to set the selection range
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.setSelectionRange(
					newCursorPosition,
					newCursorPosition,
				);
			}
		}, 0);
	};

	const clearInput = (): void => {
		setInput("");
	};

	const copyToClipboard = (): void => {
		navigator.clipboard
			.writeText(output.replace(/<[^>]+>/g, ""))
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
				<h2>Quickly Generate Dummy JSON</h2>
				<div className="toolbar-button-container">
					<button onClick={() => setInput(exampleInput)}>
						Example
					</button>
					<button onClick={() => setIsHelpModalOpen(true)}>
						Guide
					</button>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container">
					<div className="input-wrapper">
						<textarea
							ref={inputRef}
							id="input"
							value={input}
							onChange={handleInputChange}
							spellCheck={false}
							placeholder="Enter syntax - example: [5{.id(guid).email(email).active(bool)"
						/>
						<pre ref={highlightRef} id="highlight"></pre>
					</div>
					<div className="button-container">
						<button id="prettify" onClick={clearInput}>
							Clear
						</button>
					</div>
				</div>
				<div className="output-container">
					{input ? (
						<pre
							id="output"
							dangerouslySetInnerHTML={{ __html: output }}
						/>
					) : (
						<div className="faux-output">
							<div className="faux-placeholder">
								JSON will appear here
							</div>
						</div>
					)}
					<div className="button-container">
						<button id="copy" onClick={copyToClipboard}>
							Copy
						</button>
					</div>
				</div>
			</div>
			<Modal
				isOpen={isHelpModalOpen}
				onClose={() => setIsHelpModalOpen(false)}
				title="How to Use the JSON Generator"
				size="large"
			>
				<p>
					1. Start with a number in square brackets to specify how
					many objects to generate: [5]
				</p>
				<p>2. Use dot notation to define properties: .propertyName</p>
				<p>
					3. Specify data types in parentheses: (string), (number),
					(bool), etc.
				</p>
				<p>
					4. Create nested objects using curly braces: .nestedObject
					{"{ }"}
				</p>
				<p>
					5. Define arrays with square brackets and a number:
					.myArray[3]
				</p>
				<p>6. For enums, use the format: (enum:value1,value2,value3)</p>
				<p>
					7. Available data types: string, number, bool, date, time,
					guid, email, url, phone, color, ip
				</p>
				<p>8. Use the "Prettify" button to format your input</p>
				<p>
					Example:
					[2.name(string).age(number).isActive(bool).tags[3](string).address
					{"{"}.street(string).city(string)
				</p>
			</Modal>
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

export default QuickJSONGenerator;
