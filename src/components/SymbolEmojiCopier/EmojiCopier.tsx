import React, { useState, useEffect } from 'react';
import { Modal, ModalProps } from "../../utils";
import "./SymbolEmojiCopier.css";

interface EmojiData {
	emoji: string;
	name: string;
	unicode: string;
	html: string;
}

interface GroupData {
	name: string;
	emojis: EmojiData[];
}

const emojiGroups: GroupData[] = [
	{
		name: "Common Symbols",
		emojis: [
			{ emoji: "✓", name: "Check Mark", unicode: "U+2713", html: "&check;" },
			{ emoji: "✗", name: "Cross Mark", unicode: "U+2717", html: "&#10007;" },
		]
	},
	{
		name: "Math Symbols",
		emojis: [
			{ emoji: "∑", name: "Summation", unicode: "U+2211", html: "&sum;" },
			{ emoji: "∏", name: "Product", unicode: "U+220F", html: "&prod;" },
		]
	}
];

const EmojiCopier: React.FC = () => {
	const [emojiSearchTerm, setEmojiSearchTerm] = useState<string>('');
	const [groupSearchTerm, setGroupSearchTerm] = useState<string>('');
	const [fontSize, setFontSize] = useState<number>(24);
	const [filteredGroups, setFilteredGroups] = useState<GroupData[]>(emojiGroups);
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	useEffect(() => {
    const filtered = emojiGroups
      .filter(group => group.name.toLowerCase().includes(groupSearchTerm.toLowerCase()))
      .map(group => ({
        ...group,
        emojis: group.emojis.filter(emoji =>
          emoji.name.toLowerCase().includes(emojiSearchTerm.toLowerCase()) ||
          emoji.emoji.includes(emojiSearchTerm)
        )
      }))
      .filter(group => group.emojis.length > 0);
    setFilteredGroups(filtered);
  }, [emojiSearchTerm, groupSearchTerm]);

	const copyToClipboard = (text: string) => {
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
		<div className="content">
			<div className="toolbar">
				<h2>Symbol Copy & Paste</h2>
				<div className="toolbar-button-container">
					<label htmlFor="symbol-search">Search Symbol:</label>
					<input
						id="symbol-search"
						type="text"
						value={emojiSearchTerm}
						onChange={(e) => setEmojiSearchTerm(e.target.value)}
						className="text-search-input"
					/>
					<label htmlFor="group-search">Search Group:</label>
          <input
            id="group-search"
            type="text"
            value={groupSearchTerm}
            onChange={(e) => setGroupSearchTerm(e.target.value)}
            className="text-search-input"
          />
          <label htmlFor="font-size">Font Size:</label>
          <input
            id="font-size"
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            min="8"
            max="72"
            className="number-input"
          />
				</div>
			</div>
			<div className="component-container">
				<div className="symbol-grid-container">
					{filteredGroups.map((group, groupIndex) => (
						<div key={groupIndex} className="symbol-group">
							<h3>{group.name}</h3>
							<div className="symbol-grid">
								<div className="symbol-grid-header">
									<div>Symbol</div>
									<div>Name</div>
									<div>Unicode</div>
									<div>HTML</div>
								</div>
								{group.emojis.map((emoji, emojiIndex) => (
									<div key={emojiIndex} className="symbol-grid-row">
										<div>
											<div
												className='symbol-copy-button'
												onClick={() => copyToClipboard(emoji.emoji)}
												style={{ fontSize: `${fontSize}px` }}
											>
												{emoji.emoji}
											</div>
										</div>
										<div>{emoji.name}</div>
										<div>{emoji.unicode}</div>
										<div>
											<div
												className='symbol-copy-button'
												onClick={() => copyToClipboard(emoji.html)}
											>
												{emoji.html}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
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
		</div>
	);
};

export default EmojiCopier;