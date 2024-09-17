<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Security\SimpleAuthenticator;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    private $authenticatorManager;

    public function __construct(SimpleAuthenticator $authenticatorManager)
    {
        $this->authenticatorManager = $authenticatorManager;
    }

    #[Route('/my-login', name: 'app_login')]
    public function login(Request $request): JsonResponse
    {
        try {
            $user = $this->authenticatorManager->authenticate($request);
            return new JsonResponse(['message' => 'Vous êtes connecté']);
        } catch (AuthenticationException $e) {
            return new JsonResponse(['error' => "erreur lors de l'authentification"], 401);
        }
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}