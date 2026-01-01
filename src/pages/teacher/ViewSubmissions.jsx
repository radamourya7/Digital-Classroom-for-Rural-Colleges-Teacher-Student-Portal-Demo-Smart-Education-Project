import { API_BASE_URL } from '@/config';

// ... existing imports

export default function ViewSubmissions() {
  // ... existing code ...

  {
    submission.fileUrl && (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open(`${API_BASE_URL}${submission.fileUrl}`, '_blank')}
          title="View Submission"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" asChild title="Download Submission">
          <a href={`${API_BASE_URL}${submission.fileUrl}`} download target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
          </a>
        </Button>
      </>
    )
  }

  {
    submission.status !== 'pending' && (
      <Button
        size="sm"
        onClick={() => openGradeDialog(submission)}
      >
        {submission.status === 'graded' ? 'Edit Grade' : 'Grade'}
      </Button>
    )
  }
                      </div >
                    </div >
                  </div >
                ))
}
              </div >
            </CardContent >
          </Card >

  {/* Grade Dialog */ }
  < Dialog open = { gradeDialogOpen } onOpenChange = { setGradeDialogOpen } >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Grade Submission</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSubmission?.student?.name}`} />
            <AvatarFallback>{selectedSubmission?.student?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{selectedSubmission?.student?.name}</p>
            <p className="text-sm text-muted-foreground">
              Submitted: {selectedSubmission?.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="grade">Grade (out of 100)</Label>
          <Input
            id="grade"
            type="number"
            min="0"
            max="100"
            value={gradeData.grade}
            onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feedback">Feedback (optional)</Label>
          <Textarea
            id="feedback"
            placeholder="Provide feedback for the student..."
            value={gradeData.feedback}
            onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setGradeDialogOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleGrade}>Save Grade</Button>
      </DialogFooter>
    </DialogContent>
          </Dialog >
        </main >
      </div >
    </div >
  );
}
