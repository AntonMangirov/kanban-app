import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import type { CreateTaskInput } from '../../../types/database';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        board: true,
        column: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskInput = await request.json();
    
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority || 'MEDIUM',
        dueDate: body.dueDate,
        order: body.order,
        boardId: body.boardId,
        columnId: body.columnId,
        assigneeId: body.assigneeId,
      },
      include: {
        board: true,
        column: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
