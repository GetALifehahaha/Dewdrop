import React, { useState, useEffect } from 'react';
import { Title, Label, Input, Button } from '../components/atoms';
import { Toast } from '../components/molecules';
import { X, Pen, Loader2, Check } from 'lucide-react';

import { usePostAgent, usePatchAgent, useDeleteAgent } from '../hooks';

const CreateAgent = ({ agent = null }) => {
    // Hooks for API actions
    const { loading: postLoading, error: postError, response: postResponse, postAgent } = usePostAgent();
    const { loading: patchLoading, error: patchError, response: patchResponse, patchAgent } = usePatchAgent();
    const { loading: deleteLoading, error: deleteError, response: deleteResponse, deleteAgent } = useDeleteAgent();

    // Form States
    const [firstname, setFirstname] = useState(agent?.firstname ?? "");
    const [lastname, setLastname] = useState(agent?.lastname ?? "");
    const [email, setEmail] = useState(agent?.email ?? "");

    const [errorMessages, setErrorMessages] = useState([]);
    const [toastMessages, setToastMessages] = useState([]);

    const validateFields = () => {
        const errors = [];

        if (!firstname) errors.push("Please provide the agent's firstname.");
        if (!lastname) errors.push("Please provide the agent's lastname.");
        if (!email) errors.push("Please enter an email address.");

        setErrorMessages(errors);
        return errors.length === 0;
    };

    const handleSubmitAgent = async () => {
        if (!validateFields()) return;

        if (agent) {
            await patchAgent(agent.id, { first_name: firstname, last_name: lastname, email });
        } else {
            await postAgent({ first_name: firstname, last_name: lastname, email });
        }
    };

    const handleDelete = async () => {
        if (agent) await deleteAgent(agent.id);
    };

    // Combined Response + Loading
    const response = postResponse || patchResponse || deleteResponse;
    const loading = postLoading || patchLoading || deleteLoading;

    // Toast reactions
    useEffect(() => {
        if (response) {
            setToastMessages([
                {
                    message: postResponse
                        ? "Agent created successfully!"
                        : patchResponse
                        ? "Agent updated successfully!"
                        : "Agent deleted successfully!",
                    status: "success",
                    icon: Check,
                },
            ]);
        }

        if (postError || patchError || deleteError) {
            setToastMessages([
                { message: "Action failed. Please try again.", status: "error", icon: X },
            ]);
        }
    }, [response, postError, patchError, deleteError]);

    // Toast auto-dismiss
    useEffect(() => {
        if (toastMessages.length > 0) {
            const timer = setTimeout(() => setToastMessages([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessages]);

    return (
        <>
            <Toast toastMessages={toastMessages} />
            <Title text={agent ? "Edit Agent" : "Create Agent"} />

            <div className="p-4 bg-main rounded-md shadow-sm">
                <Title variant="blockTitle" text="Agent Information" icon={Pen} />

                <div className="flex flex-col">

                    {/* FIRST + LAST NAME */}
                    <div className="flex gap-2">
                        <div className="p-2 flex flex-col flex-1">
                            <Label text="Firstname" required />
                            <Input
                                value={firstname}
                                placeholder="Agent firstname"
                                onChange={setFirstname}
                            />
                        </div>

                        <div className="p-2 flex flex-col flex-1">
                            <Label text="Lastname" required />
                            <Input
                                value={lastname}
                                placeholder="Agent lastname"
                                onChange={setLastname}
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="p-2 flex flex-col">
                        <Label text="Email" required />
                        <Input
                            value={email}
                            placeholder="agent@email.com"
                            onChange={setEmail}
                        />
                    </div>

                    {/* ERRORS */}
                    {errorMessages.length > 0 && (
                        <div className="p-2 flex flex-col gap-1">
                            {errorMessages.map((msg, idx) => (
                                <h5 key={idx} className="text-sm text-red-400 font-medium flex items-center gap-2">
                                    <X size={14} /> {msg}
                                </h5>
                            ))}
                        </div>
                    )}

                    {/* BUTTONS */}
                    <div className="mx-auto mt-10 flex gap-4">

                        {/* Main Button */}
                        {response ? (
                            <h5 className='text-accent-deepblue font-semibold'>Ticket Submitted Successfully!</h5>
                        ) : loading ? (
                            <h5 className="flex gap-2 items-center">
                                <Loader2 className="text-accent-blue" size={16} /> Processing agent...
                            </h5>
                        ) : (
                            <Button
                                text={agent ? "Update Agent" : "Create Agent"}
                                onClick={handleSubmitAgent}
                            />
                        )}

                        {/* DELETE BUTTON only when editing */}
                        {agent && (
                            <Button
                                text="Delete Agent"
                                variant="danger"
                                onClick={handleDelete}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateAgent;
