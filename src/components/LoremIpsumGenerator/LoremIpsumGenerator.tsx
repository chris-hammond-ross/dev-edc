import React, { useState, useRef, useEffect } from "react";
import { Modal, ModalProps } from "../../utils";
import "./LoremIpsumGenerator.css";

type TextStyleType = "lorem" | "corporate" | "romantic";

interface CommonWords {
	articles: string[];
	pronouns: string[];
	conjunctions: string[];
	prepositions: string[];
	auxiliaryVerbs: string[];
}

interface WordLists {
	lorem: string[];
	corporate: string[];
	romantic: string[];
}

const LoremIpsumGenerator: React.FC = () => {
	const [paragraphs, setParagraphs] = useState<number>(10);
	const [output, setOutput] = useState<string>("");
	const [style, setStyle] = useState<TextStyleType>("lorem");
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");
	const outputRef = useRef<HTMLTextAreaElement>(null);

	const commonWords: CommonWords = {
		articles: ["the", "a", "an"],
		pronouns: [
			"I",
			"you",
			"he",
			"she",
			"it",
			"we",
			"they",
			"them",
			"our",
			"their",
		],
		conjunctions: ["and", "but", "or", "for", "nor", "yet", "so"],
		prepositions: [
			"in",
			"on",
			"at",
			"to",
			"for",
			"with",
			"by",
			"from",
			"of",
		],
		auxiliaryVerbs: [
			"is",
			"are",
			"was",
			"were",
			"has",
			"have",
			"had",
			"can",
			"could",
			"will",
			"would",
			"should",
			"may",
			"might",
		],
	};

	const wordLists: WordLists = {
		lorem: [
			"lorem",
			"ipsum",
			"dolor",
			"sit",
			"amet",
			"consectetur",
			"adipiscing",
			"elit",
			"sed",
			"do",
			"eiusmod",
			"tempor",
			"incididunt",
			"ut",
			"labore",
			"et",
			"dolore",
			"magna",
			"aliqua",
			"enim",
			"ad",
			"minim",
			"veniam",
			"quis",
			"nostrud",
			"exercitation",
			"ullamco",
			"laboris",
			"nisi",
			"ut",
			"aliquip",
			"ex",
			"ea",
			"commodo",
			"consequat",
			"duis",
			"aute",
			"irure",
			"dolor",
			"in",
			"reprehenderit",
			"in",
			"voluptate",
			"velit",
			"esse",
			"cillum",
			"dolore",
			"eu",
			"fugiat",
			"nulla",
			"pariatur",
			"excepteur",
			"sint",
			"occaecat",
			"cupidatat",
			"non",
			"proident",
			"sunt",
			"in",
			"culpa",
			"qui",
			"officia",
			"deserunt",
			"mollit",
			"anim",
			"id",
			"est",
			"laborum",
		],
		corporate: [
			"synergy",
			"paradigm",
			"leverage",
			"optimize",
			"innovation",
			"strategy",
			"ROI",
			"streamline",
			"implement",
			"disruptive",
			"scalable",
			"agile",
			"mindshare",
			"bandwidth",
			"deliverable",
			"blockchain",
			"ecosystem",
			"vertical",
			"horizontal",
			"proactive",
			"lean",
			"robust",
			"mission-critical",
			"cutting-edge",
			"best-of-breed",
			"next-generation",
			"turnkey",
			"win-win",
			"holistic",
			"drill-down",
			"game-changer",
			"value-added",
			"synergistic",
			"cloud",
			"AI",
			"machine learning",
			"big data",
			"IoT",
			"thought leadership",
			"growth hacking",
		],
		romantic: [
			"love",
			"heart",
			"passion",
			"desire",
			"embrace",
			"tender",
			"affection",
			"romance",
			"adore",
			"cherish",
			"enchant",
			"allure",
			"yearn",
			"devoted",
			"enamored",
			"infatuated",
			"smitten",
			"captivated",
			"enthralled",
			"besotted",
			"ardent",
			"longing",
			"dreamy",
			"starry-eyed",
			"amorous",
			"blissful",
			"euphoric",
			"rapturous",
			"soulmate",
			"sweetheart",
			"darling",
			"beloved",
			"paramour",
			"intimate",
			"gentle",
			"caress",
			"whisper",
			"moonlight",
			"candlelit",
			"roses",
			"poetry",
			"serenade",
			"flutter",
			"swoon",
			"breathless",
		],
	};

	useEffect(() => {
		setOutput(generateText(paragraphs, style));
	}, [paragraphs, style]);

	const generateText = (count: number, textStyle: TextStyleType): string => {
		const result: string[] = [];
		for (let i = 0; i < count; i++) {
			result.push(generateParagraph(textStyle));
		}
		return result.join("\n\n");
	};

	const generateParagraph = (textStyle: TextStyleType): string => {
		const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3 to 6 sentences
		const sentences: string[] = [];

		for (let i = 0; i < sentenceCount; i++) {
			sentences.push(
				textStyle === "lorem"
					? generateLoremSentence()
					: generateSentence(textStyle),
			);
		}

		return sentences.join(" ");
	};

	const generateLoremSentence = (): string => {
		const length = Math.floor(Math.random() * 10) + 5; // 5 to 14 words
		const sentence: string[] = [];

		for (let i = 0; i < length; i++) {
			sentence.push(
				wordLists.lorem[
					Math.floor(Math.random() * wordLists.lorem.length)
				],
			);
		}

		sentence[0] =
			sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
		return sentence.join(" ") + ".";
	};

	const generateSentence = (textStyle: TextStyleType): string => {
		const length = Math.floor(Math.random() * 10) + 5; // 5 to 14 words
		const sentence: string[] = [];
		let lastWordType = "";

		for (let i = 0; i < length; i++) {
			const wordType = chooseWordType(lastWordType, i === 0);
			const word = chooseWord(wordType, textStyle);
			sentence.push(word);
			lastWordType = wordType;
		}

		sentence[0] =
			sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
		return sentence.join(" ") + ".";
	};

	const chooseWordType = (lastWordType: string, isFirst: boolean): string => {
		if (isFirst) {
			return Math.random() < 0.6 ? "article" : "pronoun";
		}

		const types: string[] = [
			"article",
			"pronoun",
			"conjunction",
			"preposition",
			"auxiliaryVerb",
			"content",
		];
		const weights: { [key: string]: number[] } = {
			article: [0, 5, 1, 3, 4, 20],
			pronoun: [1, 0, 2, 3, 5, 20],
			conjunction: [3, 3, 0, 2, 3, 20],
			preposition: [5, 3, 2, 0, 2, 20],
			auxiliaryVerb: [2, 4, 2, 2, 0, 20],
			content: [4, 4, 3, 5, 5, 10],
		};

		const currentWeights = weights[lastWordType] || weights.content;
		const totalWeight = currentWeights.reduce((a, b) => a + b, 0);
		let randomWeight = Math.random() * totalWeight;

		for (let i = 0; i < types.length; i++) {
			if (randomWeight < currentWeights[i]) {
				return types[i];
			}
			randomWeight -= currentWeights[i];
		}

		return "content";
	};

	const chooseWord = (wordType: string, textStyle: TextStyleType): string => {
		if (wordType === "content") {
			const words = wordLists[textStyle];
			return words[Math.floor(Math.random() * words.length)];
		} else {
			const words = commonWords[(wordType + "s") as keyof CommonWords];
			return words[Math.floor(Math.random() * words.length)];
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const value = Math.max(1, parseInt(e.target.value, 10) || 1);
		setParagraphs(value);
	};

	const handleStyleChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	): void => {
		setStyle(e.target.value as TextStyleType);
	};

	const copyToClipboard = (): void => {
		navigator.clipboard
			.writeText(output)
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
				<h2>Lorem Ipsum Generator</h2>
				<div className="toolbar-button-container">
					<div className="toolbar-button-lable-container">
						<label htmlFor="paragraphs">Paragraphs:</label>
						<input
							type="number"
							id="paragraphs"
							min="1"
							value={paragraphs}
							onChange={handleInputChange}
						/>
					</div>
					<div className="toolbar-button-lable-container">
						<label htmlFor="style">Style:</label>
						<select
							id="style"
							value={style}
							onChange={handleStyleChange}
						>
							<option value="lorem">Lorem Ipsum</option>
							<option value="corporate">Corporate Speak</option>
							<option value="romantic">Romantic Novel</option>
						</select>
					</div>
				</div>
			</div>
			<div className="component-container">
				<div className="output-container">
					<textarea
						spellCheck={false}
						ref={outputRef}
						value={output}
						readOnly
						placeholder="Generated Lorem Ipsum will appear here..."
					/>
					<button onClick={copyToClipboard}>Copy</button>
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

export default LoremIpsumGenerator;
