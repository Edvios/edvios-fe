# Agent Assignment Module

This module manages the assignment of agents to students.

## Structure

```
agent-assignment/
├── api/
│   └── assignment.api.ts       # API functions for fetching and updating assignments
├── components/
│   ├── AssignmentsTable.tsx    # Main table component with inline agent selection
│   └── ConfirmAssignmentDialog.tsx # Confirmation dialog before updating
├── hooks/
│   ├── use-assignments.ts      # Hook for fetching assignments data
│   └── use-agent-selector.ts   # Hook for agent selection logic
├── types/
│   └── assignment.types.ts     # TypeScript interfaces
└── page.tsx                     # Main page component

```

## Features

1. **View Assignments**: Display all student-agent assignments in a table
2. **Search**: Filter assignments by student name or email
3. **Statistics**: Show total, assigned, and unassigned counts
4. **Inline Agent Selection**: 
   - Click on assigned agent to open dropdown
   - Search through available agents
   - Select new agent from list
5. **Confirmation**: Popup confirmation before updating assignment
6. **Real-time Updates**: Table refreshes after successful assignment

## API Endpoints

- `GET /students/assignments` - Fetch all assignments with pagination and search
- `PATCH /students/:studentId/assign-agent` - Update agent assignment

## Usage

Navigate to `/agent-assignment` to access this module.
