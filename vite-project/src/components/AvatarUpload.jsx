import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AvatarUpload({ onUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = (await supabase.auth.getUser()).data.user;
    const userId = user?.id;
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    setUploading(true);

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
        metadata: {
          owner_id: userId
        }
      });

    if (error) {
      alert('업로드 실패: ' + error.message);
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      onUploaded(publicUrl);
    }

    setUploading(false);
  };

  return (
    <div>
      <span>아바타 변경: </span>
      <button>
        <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
      </button>
      
    </div>
  );
}
