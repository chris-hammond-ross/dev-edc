import { useState, useEffect } from "react";
import { Modal, ModalProps } from "../../utils";
import "./HashGenerator.css";

interface HashTypes {
	md5: string;
	sha1: string;
	sha256: string;
	sha512: string;
}

const HashGenerator = () => {
	const [input, setInput] = useState<string>("");
	const [hashes, setHashes] = useState<HashTypes>({
		md5: "",
		sha1: "",
		sha256: "",
		sha512: "",
	});
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	useEffect(() => {
		generateHashes();
	}, [input]);

	const generateHashes = async (): Promise<void> => {
		if (!input) {
			setHashes({
				md5: "",
				sha1: "",
				sha256: "",
				sha512: "",
			});
			return;
		}

		const encoder = new TextEncoder();
		const data = encoder.encode(input);

		try {
			const [sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
				crypto.subtle.digest("SHA-1", data),
				crypto.subtle.digest("SHA-256", data),
				crypto.subtle.digest("SHA-512", data),
			]);

			setHashes({
				md5: "MD5 is not supported due to security concerns",
				sha1: bufferToHex(sha1Hash),
				sha256: bufferToHex(sha256Hash),
				sha512: bufferToHex(sha512Hash),
			});
		} catch (error) {
			console.error("Error generating hashes:", error);
		}
	};

	const bufferToHex = (buffer: ArrayBuffer): string => {
		return Array.from(new Uint8Array(buffer))
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);
	};

	const clearInput = (): void => {
		setInput("");
	};

	const copyToClipboard = (hash: string) => {
		navigator.clipboard
			.writeText(hash)
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
				<h2>Hash Generator</h2>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						value={input}
						onChange={handleInputChange}
						placeholder="Enter text to hash"
					/>
					<button onClick={() => clearInput()}>Clear</button>
				</div>
				<div className="output-container">
					{Object.entries(hashes).map(([algorithm, hash]) => (
						<div key={algorithm} className="output-segment">
							<h3>{algorithm.toUpperCase()}</h3>
							<textarea
								spellCheck={false}
								className="output-pre"
								value={hash}
								readOnly
								placeholder="Output will appear here"
							/>
							<button onClick={() => copyToClipboard(hash)}>
								Copy
							</button>
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
		</>
	);
};

export default HashGenerator;
