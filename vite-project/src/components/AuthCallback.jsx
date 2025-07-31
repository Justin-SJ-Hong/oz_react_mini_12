import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useUserStore } from "../store/userStore";

export default function AuthCallback() {
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        (async () => {
            const {data: {session}} = await supabase.auth.getSession();

            if(session?.user) {
                const user = session.user;
                const meta = user.user_metadata || {};

                const userInfo = {
                    id: user.id,
                    email: user.email,
                    displayName: meta.full_name || meta.name || "사용자",
                    avatarUrl: meta.avatar_url || meta.picture || null,
                };

                setUser(userInfo);
            }

            navigate('/');
        }) ();
    }, [navigate, setUser])

    return <p>로그인 처리중..........</p>;
}