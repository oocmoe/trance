import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type HeadingProps = {
	children: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
	className?: string;
};

export const Heading = ({ children, size = "lg", className }: HeadingProps) => {
	const sizeClasses = {
		sm: "text-sm",
		md: "text-md",
		lg: "text-lg",
		xl: "text-xl",
		"2xl": "text-2xl",
		"3xl": "text-3xl",
		"4xl": "text-4xl",
		"5xl": "text-5xl",
		"6xl": "text-6xl",
	};

	return <Text className={cn(sizeClasses[size], "font-bold", className)}>{children}</Text>;
};
