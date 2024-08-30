import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Modal, ModalProps } from "../../utils";
import "./MarkdownPreviewer.css";

const MarkdownPreviewer: React.FC = () => {
	const [markdownText, setMarkdownText] = useState<string>("");
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		setMarkdownText(e.target.value);
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

	const clearInput = (): void => {
		setMarkdownText("");
	};

	const showExample = (): void => {
		const exampleMarkdown = `# Markdown Example

## Headings

### This is a third-level heading

## Formatting

**Bold text** and *italic text*

## Lists

- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2

## Links and Images

[Visit Wikipedia](https://www.wikipedia.org)

![Alt text for image](https://fastly.picsum.photos/id/866/200/100.jpg?hmac=JLu6lJgeXccHaAjSVMU4YS525cLhXrUUrKYTDPKvNEo)

## Code

Inline \`code\` looks like this.

\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

## Blockquotes

> This is a blockquote.  
It can span multiple lines.  
Remember to add a double space at the end of each line.

## Horizontal Rule

---

## Tables

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;
		setMarkdownText(exampleMarkdown);
	};

	return (
		<>
			<div className="toolbar">
				<h2>Markdown Previewer</h2>
				<div className="toolbar-button-container">
					<button onClick={showExample}>Example</button>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						value={markdownText}
						onChange={handleInputChange}
						placeholder="Enter Markdown text"
					/>
					<div className="button-container">
						<button onClick={clearInput}>Clear</button>
					</div>
				</div>
				<div className="output-container">
					<div className="markdown-preview">
						{markdownText ? (
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{markdownText}
							</ReactMarkdown>
						) : (
							<div className="faux-placeholder">
								Formatted text will appear here
							</div>
						)}
					</div>
					<div className="button-container">
						<button
							onClick={() => copyToClipboard(markdownText)}
							disabled={!markdownText}
						>
							Copy Markdown
						</button>
					</div>
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

export default MarkdownPreviewer;
