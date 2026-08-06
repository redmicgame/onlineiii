import re

with open('components/XProfileView.tsx', 'r') as f:
    content = f.read()

# Add states for edit mode
old_states = """    const [showPremiumModal, setShowPremiumModal] = React.useState(false);
    const { selectedXUserId } = gameState;"""

new_states = """    const [showPremiumModal, setShowPremiumModal] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editName, setEditName] = React.useState('');
    const [editBio, setEditBio] = React.useState('');
    const [editHeader, setEditHeader] = React.useState('');
    const [editAvatar, setEditAvatar] = React.useState('');
    const { selectedXUserId } = gameState;"""

content = content.replace(old_states, new_states)

old_edit_fn = """    const handleMessage = () => {"""

new_edit_fn = """    const handleEditProfile = () => {
        if (!user) return;
        setEditName(user.name);
        setEditBio(user.bio || '');
        setEditHeader(user.headerImage || '');
        setEditAvatar(user.avatar || '');
        setIsEditing(true);
    };

    const handleSaveProfile = () => {
        if (!user) return;
        dispatch({ type: 'EDIT_X_PROFILE', payload: { userId: user.id, name: editName, bio: editBio, headerImage: editHeader, avatar: editAvatar } });
        setIsEditing(false);
    };

    const handleMessage = () => {"""

content = content.replace(old_edit_fn, new_edit_fn)

old_buttons = """                    <div className="flex justify-end p-4 pt-2 mb-12">
                        {user.id !== playerUser?.id ? ("""

new_buttons = """                    <div className="flex justify-end p-4 pt-2 mb-12">
                        {user.id !== playerUser?.id ? ("""

content = content.replace(old_buttons, new_buttons)
# Wait, I need to check where to put the Edit Profile button. Let's see the render part.
with open('components/XProfileView.tsx', 'w') as f:
    f.write(content)
