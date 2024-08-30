import React from "react";
import "./TimestampConverter.css";

interface AnalogClockProps {
	timestamp: number | string;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ timestamp }) => {
	// Convert timestamp to Date object
	const date = new Date(timestamp);

	// Calculate clock hand angles
	const secondAngle = (date.getSeconds() / 60) * 360;
	const minuteAngle =
		((date.getMinutes() + date.getSeconds() / 60) / 60) * 360;
	const hourAngle =
		(((date.getHours() % 12) + date.getMinutes() / 60) / 12) * 360;

	return (
		<div className="clock-face">
			{/* Clock face */}
			{[...Array(12)].map((_, i) => (
				<div
					key={i}
					className="hour-marker"
					style={{
						transform: `rotate(${i * 30}deg) translateY(-28px)`,
					}}
				/>
			))}

			{/* Hour hand */}
			<div
				className="hand hour-hand"
				style={{ transform: `rotate(${hourAngle}deg)` }}
			/>

			{/* Minute hand */}
			<div
				className="hand minute-hand"
				style={{ transform: `rotate(${minuteAngle}deg)` }}
			/>

			{/* Second hand */}
			<div
				className="hand second-hand"
				style={{ transform: `rotate(${secondAngle}deg)` }}
			/>

			{/* Center dot */}
			<div className="center-dot" />
		</div>
	);
};

export default AnalogClock;
