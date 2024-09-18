<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class SessionController extends AbstractController
{
    #[Route('/session/start', name: 'session_start', methods: ['POST'])]
    public function startSession(Request $request): JsonResponse
    {
        $session = $request->getSession();

        if (!$session->isStarted()) {
            $session->start();
        }

        // Réinitialise la session si elle existe déjà
        $session->set('isLogged', false);
        $session->set('user_id', time());

        return new JsonResponse(['status' => 'Session started'], 200);
    }

    #[Route('/session/check', name: 'session_check', methods: ['GET'])]
    public function checkSession(Request $request): JsonResponse
    {
        $session = $request->getSession();
        $user = $this->getUser();
    
        if (!$session->has('user_id') || !$user) {
            return new JsonResponse(['message' => 'No session found'], 404);
        }
    
        $sessionData = [
            'isLogged' => true,
            'id' => $session->get('user_id'),
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
        ];
    
        return new JsonResponse(['sessionData' => $sessionData], 200);            
    }

    #[Route('/session/logout', name: 'session_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $session = $request->getSession();
        $session->invalidate();

        return new JsonResponse(['message' => 'Logout successful'], 200);
    }
}
