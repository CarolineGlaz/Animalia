<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Logout\LogoutHandlerInterface;

class SessionController extends AbstractController
{
    #[Route('/session/start', name: 'session_start')]
    public function startSession(Request $request): JsonResponse
    {
        $session = $request->getSession();

        if (!$session->isStarted()) {
            $session->start();
        } else {
            $session->clear();
        }

        $session->set('isLogged', false);
        $session->set('user_id', time());
        return new JsonResponse(['status' => 'Session started'], 200);
    }

    #[Route('/session/check', name: 'session_check')]
    public function checkSession(Request $request): JsonResponse
    {
        $session = $request->getSession();

        if (!$session->has('user_id')) {
            return new JsonResponse(['message' => 'No session found'], 404);
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
        $session->invalidate();

        return new JsonResponse(['message' => 'Logout successful'], 200);
    }
}

