import React, { useState, useEffect } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { Menu, Eye, EyeOff } from "lucide-react";
import "./NavigationConfig.css";

interface NavItem {
	to: string;
	label: string;
	id: string;
	hidden: boolean;
}

interface NavigationConfigProps {
	navItems: NavItem[];
	onSaveSettings: (items: NavItem[]) => void;
}

const NavigationConfig: React.FC<NavigationConfigProps> = ({
	navItems,
	onSaveSettings,
}) => {
	const [localNavItems, setLocalNavItems] = useState<NavItem[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [activeId, setActiveId] = useState<string | null>(null);

	useEffect(() => {
		setLocalNavItems(navItems);
	}, [navItems]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		setIsDragging(true);
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		setIsDragging(false);
		setActiveId(null);
		const { active, over } = event;
		if (active.id !== over?.id) {
			setLocalNavItems((items) => {
				const oldIndex = items.findIndex(
					(item) => item.id === active.id,
				);
				const newIndex = items.findIndex(
					(item) => item.id === over?.id,
				);
				const newItems = arrayMove(items, oldIndex, newIndex);
				onSaveSettings(newItems);
				return newItems;
			});
		}
	};

	const toggleNavItemVisibility = (id: string): void => {
		if (!isDragging) {
			setLocalNavItems((prevItems) => {
				const updatedItems = prevItems.map((item: NavItem) =>
					item.id === id ? { ...item, hidden: !item.hidden } : item,
				);
				onSaveSettings(updatedItems);
				return updatedItems;
			});
		}
	};

	return (
		<div className="navigation-config">
			Drag items to reorder, or click the eye icon to show/hide items.
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={localNavItems.map((item) => item.id)}
					strategy={verticalListSortingStrategy}
				>
					<ul className="nav-items-list">
						{localNavItems.map((item) => (
							<SortableItem key={item.id} id={item.id}>
								<div
									className={`nav-item ${item.hidden ? "hidden" : ""} ${
										activeId === item.id ? "dragging" : ""
									}`}
								>
									<div className="nav-item-drag-label-container">
										<Menu
											size={18}
											className="drag-handle"
										/>
										<span>{item.label}</span>
									</div>
									<button
										onClick={() =>
											toggleNavItemVisibility(item.id)
										}
										className="visibility-toggle"
										onPointerDown={(e) =>
											e.stopPropagation()
										}
									>
										{item.hidden ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>
							</SortableItem>
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</div>
	);
};

export default NavigationConfig;
