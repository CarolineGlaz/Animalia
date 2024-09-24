<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SessionController extends AbstractController
{
    #[Route('/session/start', name: 'session_start', methods: ['POST'])]
    public function startSession(Request $request): JsonResponse
    {
        $session = $request->getSession();

        if (!$session->isStarted()) {
            $session->start();
        }

        $userId = time();
        $session->set('isLogged', false);
        $session->set('user_id', $userId);

        return new JsonResponse(['status' => 'Session démarrée'], 200);
    }

    #[Route('/session/check', name: 'session_check', methods: ['GET'])]
    public function checkSession(Request $request): JsonResponse
    {
        $session = $request->getSession();

        if (!$session->has('user_id')) {
            return new JsonResponse(['message' => 'La session non trouvée'], 404);
        }

        $sessionData = [
            'isLogged' => $session->get('isLogged'),
            'id' => $session->get('user_id'),
        ];

        return new JsonResponse(['sessionData' => $sessionData], 200);            
    }

    #[Route('/session/logout', name: 'session_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $session = $request->getSession();

        if ($session->isStarted()) {
            $session->invalidate();
        }

        return new JsonResponse(['message' => 'Déconnexion réussie'], 200);
    }

}
