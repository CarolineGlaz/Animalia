# Afficher la branche Git dans l'invite de commande
function parse_git_branch {
    git branch 2>/dev/null | grep '*' | sed 's/* //'
}

export PS1='\u@\h:\w$(parse_git_branch) \$ '
