<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SessionController extends AbstractController
{
    #[Route('/session/start', name: 'session_start')]
    public function startSession(Request $request): JsonResponse
    {
        $session = $request->getSession();

        if (!$session->isStarted()) {
            $session->start();
        }

        $session->set('user_id', time());
        $response = new JsonResponse(['status' => 'Session started'], 200);
        return $response;
    }

    #[Route('/session/check', name: 'session_check')]
    public function checkSession(Request $request): Response
    {
        $session = $request->getSession();

        if ($session->has('user_id')) {
            $userId = $session->get('user_id');
            $sessionData = [
                'isLogged'=> true,
                'id' => $session->get('user_id'),
            ];
            $response = new JsonResponse(['sessionData' => $sessionData], 200);
            return $response;
        } else {
            $response = new Response('No session found', 404);
            return $response;
        }
    }
}
