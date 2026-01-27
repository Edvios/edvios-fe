"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Program } from "@/app/program-finder/types/program";
import { ProgramApplicationRequest } from "@/app/program-finder/dtos/program.dto";
import { Intake } from "@/app/program-finder/types/program";
import { CheckCircle2, Loader2, Info } from "lucide-react";

interface ProgramApplyDialogProps {
    program: Program | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ProgramApplicationRequest) => Promise<void>;
    intakes: Intake[];
}

export const ProgramApplyDialog: React.FC<ProgramApplyDialogProps> = ({
    program,
    open,
    onOpenChange,
    onSubmit,
    intakes,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        academicYear: "",
        preferredIntakeId: "",
        additionalNotes: "",
    });

    // Reset form and success state when dialog opens
    React.useEffect(() => {
        if (open) {
            setIsSuccess(false);
            setFormData({
                academicYear: "",
                preferredIntakeId: "",
                additionalNotes: "",
            });
        }
    }, [open]);

    if (!program) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                programId: program.id,
                academicYear: formData.academicYear,
                preferredIntakeId: formData.preferredIntakeId,
                additionalNotes: formData.additionalNotes,
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Application submission failed:", error);
            alert("Failed to submit application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                <div className="px-6 py-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            {isSuccess ? "Application Sent!" : "Apply for Program"}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mt-1">
                            {isSuccess ? (
                                <span className="text-center block">
                                    Your application for <strong>{program.title}</strong> has been successfully submitted.
                                </span>
                            ) : (
                                <>
                                    You are applying for <span className="font-semibold text-primary">{program.title}</span> at {program.institution}.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <Button
                                onClick={handleClose}
                                className="w-full sm:w-auto bg-gradient text-white px-12 shadow-lg hover:shadow-xl transition-all"
                            >
                                Close
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="academicYear">Academic Year</Label>
                                    <Select
                                        value={formData.academicYear}
                                        onValueChange={(val) => setFormData({ ...formData, academicYear: val })}
                                        required
                                    >
                                        <SelectTrigger id="academicYear" className="w-full">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2025">2025</SelectItem>
                                            <SelectItem value="2026">2026</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="preferredIntake">Preferred Intake</Label>
                                    <Select
                                        value={formData.preferredIntakeId}
                                        onValueChange={(val) => setFormData({ ...formData, preferredIntakeId: val })}
                                        required
                                    >
                                        <SelectTrigger id="preferredIntake" className="w-full">
                                            <SelectValue placeholder="Select Intake" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {intakes.map((intake) => (
                                                <SelectItem key={intake.id} value={intake.id}>
                                                    {intake.name}
                                                </SelectItem>
                                            ))}
                                            {intakes.length === 0 && (
                                                <SelectItem value="none" disabled>No intakes available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="additionalNotes">Additional Information</Label>
                                <Textarea
                                    id="additionalNotes"
                                    placeholder="Tell us more about your background or any specific questions you have..."
                                    className="min-h-[120px] resize-none focus:ring-primary/20"
                                    value={formData.additionalNotes}
                                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                                    <Info className="h-3 w-3" />
                                    This information helps us process your application faster.
                                </p>
                            </div>

                            <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end items-center">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full sm:w-auto text-gray-600 hover:bg-gray-100"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto bg-gradient text-white px-8 shadow-lg hover:shadow-xl transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Confirm Application"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
