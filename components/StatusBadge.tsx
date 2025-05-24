import { Badge } from "./ui/badge";
import { Text } from "./ui/text";
export default function StatusBadge({
	status,
}: {
	status: "active" | "offline";
}) {
	return (
		<Badge className={status === "active" ? "bg-green-400" : "bg-gray-400"}>
			{status === "active" && <Text>活动</Text>}
			{status === "offline" && <Text>禁用</Text>}
		</Badge>
	);
}
