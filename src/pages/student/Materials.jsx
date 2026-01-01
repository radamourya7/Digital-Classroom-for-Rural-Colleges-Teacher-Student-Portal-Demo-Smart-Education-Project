import { API_BASE_URL } from '@/config';

// ... existing code ...

{
  materials.map((m) => (
    <MaterialCard
      key={m._id}
      id={m._id}
      title={m.title}
      type={m.type && m.type.includes('pdf') ? 'pdf' : m.type && m.type.includes('video') ? 'video' : 'other'}
      downloadUrl={`${API_BASE_URL}${m.fileUrl}`} // prepend backend URL
      uploadedAt={new Date(m.createdAt).toLocaleDateString()}
    />
  ))
}
            </div >
          ) : (
  <div className="text-center py-12">
    <p className="text-muted-foreground">No materials found for this class.</p>
  </div>
)}
        </main >
      </div >
    </div >
  );
}
