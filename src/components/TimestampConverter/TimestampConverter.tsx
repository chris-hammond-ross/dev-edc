import React, { useState, useEffect, useRef } from "react";
import AnalogClock from "./AnalogClock";
import { Modal, ModalProps } from "../../utils";
import "./TimestampConverter.css";

interface ConvertedDates {
	localDate: string;
	utcDate: string;
	isoString: string;
	relativeTime: string;
	unixTimestamp: string;
	rfc2822: string;
	iso8601WithOffset: string;
	customFormat: string;
	dayOfWeek: string;
	quarterOfYear: string;
	weekOfYear: string;
	dayOfYear: string;
	unixTimestampMs: string;
	time12Hour: string;
	timezoneName: string;
}

interface HumanReadableDate {
	time: string;
	date: string;
}

const TimestampConverter: React.FC = () => {
	const [timestamp, setTimestamp] = useState<string | number>("");
	const [hasTimeStopped, setHasTimeStopped] = useState<boolean>(true);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [convertedDates, setConvertedDates] = useState<ConvertedDates>({
		localDate: "",
		utcDate: "",
		isoString: "",
		relativeTime: "",
		unixTimestamp: "",
		rfc2822: "",
		iso8601WithOffset: "",
		customFormat: "",
		dayOfWeek: "",
		quarterOfYear: "",
		weekOfYear: "",
		dayOfYear: "",
		unixTimestampMs: "",
		time12Hour: "",
		timezoneName: "",
	});
	const [humanReadableDate, setHumanReadableDate] =
		useState<HumanReadableDate>({
			time: "",
			date: "",
		});
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	const clearHumanReadable = (): void => {
		setHumanReadableDate({
			time: "",
			date: "",
		});
	};

	const showExample = (): void => {
		setTimestamp(new Date().getTime());
	};

	const toggleTime = (): void => {
		setHasTimeStopped((prevState) => {
			const newState = !prevState;

			if (intervalRef.current) clearInterval(intervalRef.current);

			if (!newState) {
				intervalRef.current = setInterval(() => {
					setTimestamp(new Date().getTime());
				}, 100);
			}

			return newState;
		});
	};

	useEffect(() => {
		clearHumanReadable();
		convertTimestamp(timestamp);
	}, [timestamp]);

	const convertTimestamp = (value: string | number): void => {
		if (!value) {
			setConvertedDates(
				Object.fromEntries(
					Object.keys(convertedDates).map((key) => [key, ""]),
				) as unknown as ConvertedDates,
			);
			return;
		}

		let date;
		if (value.toString().length === 10) {
			// Assume it's a Unix timestamp in seconds
			date = new Date(parseInt(value as string) * 1000);
		} else {
			// Assume it's a Unix timestamp in milliseconds
			date = new Date(parseInt(value as string));
		}

		if (isNaN(date.getTime())) {
			setConvertedDates(
				Object.fromEntries(
					Object.keys(convertedDates).map((key) => [
						key,
						"Invalid timestamp",
					]),
				) as unknown as ConvertedDates,
			);
			return;
		}

		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		let relativeTime;
		if (days > 0) {
			relativeTime = `${days} day${days > 1 ? "s" : ""} ago`;
		} else if (hours > 0) {
			relativeTime = `${hours} hour${hours > 1 ? "s" : ""} ago`;
		} else if (minutes > 0) {
			relativeTime = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		} else {
			relativeTime = `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
		}

		setHumanReadableDate({
			time: date.toLocaleString("en-US", {
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
				hour12: true,
			}),
			date: fancyDate(date),
		});

		setConvertedDates({
			localDate: date.toLocaleString(),
			utcDate: date.toUTCString(),
			isoString: date.toISOString(),
			relativeTime: relativeTime,
			unixTimestamp: Math.floor(date.getTime() / 1000).toString(),
			rfc2822: date.toUTCString(),
			iso8601WithOffset: date
				.toISOString()
				.replace("Z", getTimezoneOffset(date)),
			customFormat: formatDate(date, "YYYY-MM-DD HH:mm:ss"),
			dayOfWeek: date.toLocaleString("en-US", { weekday: "long" }),
			quarterOfYear: `Q${Math.floor(date.getMonth() / 3) + 1}`,
			weekOfYear: getWeekNumber(date).toString(),
			dayOfYear: getDayOfYear(date).toString(),
			unixTimestampMs: date.getTime().toString(),
			time12Hour: date.toLocaleString("en-US", {
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
				hour12: true,
			}),
			timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
		});
	};

	const getTimezoneOffset = (date: Date): string => {
		const offset = -date.getTimezoneOffset();
		const sign = offset >= 0 ? "+" : "-";
		const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(
			2,
			"0",
		);
		const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
		return `${sign}${hours}:${minutes}`;
	};

	const formatDate = (date: Date, format: string): string => {
		const pad = (num: number) => String(num).padStart(2, "0");
		return format
			.replace("YYYY", date.getFullYear().toString())
			.replace("MM", pad(date.getMonth() + 1))
			.replace("DD", pad(date.getDate()))
			.replace("HH", pad(date.getHours()))
			.replace("mm", pad(date.getMinutes()))
			.replace("ss", pad(date.getSeconds()));
	};

	const getWeekNumber = (date: Date): number => {
		const d = new Date(
			Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
		);
		const dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil(
			((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
		);
	};

	const getDayOfYear = (date: Date): number => {
		const start = new Date(date.getFullYear(), 0, 0);
		const diff = date.getTime() - start.getTime();
		const oneDay = 1000 * 60 * 60 * 24;
		return Math.floor(diff / oneDay);
	};

	const fancyDate = (date: Date): string => {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		const dayOfWeek = days[date.getDay()];
		const dayOfMonth = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear();

		const suffix = getDaySuffix(dayOfMonth);

		return `${dayOfWeek} ${dayOfMonth}${suffix} of ${month}, ${year}`;
	};

	function getDaySuffix(day: number): string {
		if (day >= 11 && day <= 13) {
			return "th";
		}
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	}

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
				<h2>Timestamp Converter</h2>
				<div className="toolbar-button-container">
					<button onClick={() => showExample()}>Example</button>
					<button
						className="timestamp-toolbar-button"
						onClick={() => toggleTime()}
					>
						{hasTimeStopped ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<path
									d="M0 0L24 12L0 24Z"
									fill="currentColor"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<rect
									x="0"
									y="0"
									width="10"
									height="24"
									fill="currentColor"
								/>
								<rect
									x="14"
									y="0"
									width="10"
									height="24"
									fill="currentColor"
								/>
							</svg>
						)}
					</button>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						value={timestamp}
						onChange={(e) => setTimestamp(e.target.value)}
						placeholder="Enter Unix timestamp (seconds or milliseconds)"
					/>
					{timestamp ? (
						<div className="timestamp-human-readable">
							<div className="timestamp-human-time">
								{humanReadableDate.time}
							</div>
							<div className="timestamp-human-date">
								{humanReadableDate.date}
							</div>
							{timestamp && <AnalogClock timestamp={timestamp} />}
						</div>
					) : (
						<div className="faux-output">
							<div className="faux-placeholder">
								Human readable time will appear here
							</div>
						</div>
					)}
				</div>
				<div className="timestamp-output-container">
					{Object.entries(convertedDates).map(([key, value]) => (
						<div key={key} className="output-segment">
							<h3>
								{key.charAt(0).toUpperCase() +
									key.slice(1).replace(/([A-Z])/g, " $1")}
							</h3>
							<div className="timestamp-date-container">
								<p className="date-output">{value}</p>
								<button
									onClick={() => copyToClipboard(value)}
									disabled={!value}
								>
									Copy
								</button>
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
		</>
	);
};

export default TimestampConverter;
