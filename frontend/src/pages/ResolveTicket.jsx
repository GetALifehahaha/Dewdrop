import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { Check, Hourglass, X } from "lucide-react";
import axios from 'axios'

const ResolveTicket = () => {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const agentId = searchParams.get("agent_id");
	const [status, setStatus] = useState("loading");
	const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID
	const requesterTemplate = import.meta.env.VITE_REQUESTER_TEMPLATE_ID
	const url = import.meta.env.VITE_API_URL

	useEffect(() => {
		const resolveTheTicket = async () => {
			try {
				const res = await axios.get(
					`${url}tickets/tickets/${id}/resolve/?token=${token}&agent_id=${agentId}`
				);

				if (res.status === 200) {
					const data = res.data;

					const emailPayload = {
						requester_email: data.requester_email,
						requester_name: data.requester_name,
						ticket_title: data.ticket_title,
						header_message: `Good news! Your ticket "${data.ticket_title}" has been resolved!`,
						second_message:
							"If you have further issues, please submit a new ticket.",
					};

					await emailjs.send(
						serviceId,
						requesterTemplate,
						emailPayload,
					);
					setStatus("success");
				}
			} catch (error) {
				setStatus("error");
			}
		};

		if (id && token) {
			resolveTheTicket();
		}
	}, [id, token, agentId]);

	return (
		<div className="flex flex-col w-full h-screen justify-center items-center">
			{status === "loading" &&
				<>
					<Hourglass className="text-text/50 animate-spin" size={38} />
					<h5 className="mt-4 text-text/75 font-semibold text-lg">Resolving ticket. Please wait for a bit...</h5>
				</>}

			{status === "success" && (
				<>
					<Check className="text-green-400 animate-bounce" size={38} />
					<h5 className="mt-4 text-text/75 font-semibold text-lg">Ticket resolved! You can now leave this page.</h5>
					<h5 className="mt-1 text-text/75 font-semibold text-xl">Thank you for your service!</h5>
				</>
			)}

			{status === "error" && (
				<>
					<X className="text-red-400 animate-bounce" size={38} />
					<h5 className="mt-4 text-text/75 font-semibold text-lg">Ticket error. Something went wrong...</h5>
				</>
			)}
		</div>
	);
};

export default ResolveTicket;
