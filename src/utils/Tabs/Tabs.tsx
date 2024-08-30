import React, { useState } from "react";
import "./Tabs.css";

interface Tab {
	id: string;
	label: string;
	content: React.ReactNode;
}

interface TabsProps {
	tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
	const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

	return (
		<div className="tabs-container">
			<div className="tabs-header">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
						onClick={() => setActiveTab(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="tab-content">
				{tabs.find((tab) => tab.id === activeTab)?.content}
			</div>
		</div>
	);
};

export default Tabs;
