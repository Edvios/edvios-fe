"use client";
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Banknote, GraduationCap } from 'lucide-react';
import { Program } from '@/app/program-finder/types/program';

interface ProgramCardProps {
    program: Program;
    onDetailClick: (program: Program) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onDetailClick }) => {
    return (
        <Card className="hover:shadow-xl transition-shadow duration-200 h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{program.title}</h3>
                        <p className="text-secondary-foreground font-medium mt-1">{program.institution}</p>
                    </div>
                    {program.scholarship && (
                        <div className="inline-flex items-center rounded-full border border-transparent bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 transition-colors hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shrink-0">
                            Scholarship
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{program.location}, {program.country}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow pb-2">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{program.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{program.intake}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-gray-900">{program.tuitionFee}</span>
                    </div>
                </div>
                <div className="mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                        <span className="block font-medium text-gray-700">English Score</span>
                        {program.englishTestScore}
                    </div>
                    <div>
                        <span className="block font-medium text-gray-700">App Deadline</span>
                        {program.applicationDeadline}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2 gap-3 flex flex-col sm:flex-row">
                <Button
                    variant="outline"
                    className="w-full sm:w-1/2 border-primary/20 hover:bg-primary/5 hover:text-primary"
                    onClick={() => onDetailClick(program)}
                >
                    View Details
                </Button>
                <Button
                    className="w-full sm:w-1/2  text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-orange-gradient"
                    style={{
                        background: 'bg-orange-gradient',
                    }}
                >
                    Apply Now
                </Button>
            </CardFooter>
        </Card>
    );
};
