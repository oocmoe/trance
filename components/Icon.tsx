import { cssInterop } from "nativewind";
import { type ComponentType, forwardRef } from "react";
import type { StyleProp, TextStyle, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

type IconProps = {
	as: ComponentType<any>;
	size?: number;
	color?: string;
	className?: string;
	style?: StyleProp<TextStyle>;
};

const Icon = forwardRef<View, IconProps>(({ as: IconComponent, size = 24, color, className, style }, ref) => {
	cssInterop(IconComponent, {
		className: {
			target: "style",
			nativeStyleToProp: { color: true, opacity: true },
		},
	});

	return (
		<IconComponent
			ref={ref}
			size={size}
			color={color}
			className={className ? className : "text-foreground"}
			style={style ? style : ""}
		/>
	);
});

export default Icon;
