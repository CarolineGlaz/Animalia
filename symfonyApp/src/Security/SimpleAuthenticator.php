<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;

class SimpleAuthenticator extends AbstractLoginFormAuthenticator
{
    public const LOGIN_ROUTE = 'app_login';

    public function __construct(private UrlGeneratorInterface $urlGenerator)
    {
    }

    public function supports(Request $request): bool
    {
        return $request->getPathInfo() === '/my-login' && $request->isMethod('POST');
    }

    public function authenticate(Request $request): Passport
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        return new Passport(
            new UserBadge($email),
            new PasswordCredentials($password)
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): JsonResponse
    {
        $session = $request->getSession();
        $user = $token->getUser();
        $userId = $user->getId();

        $isAdmin = false;
        if(in_array("ROLE_ADMIN", $user->getRoles()))
            $isAdmin = true;

        $isEmploye = false;
        if(in_array("ROLE_EMPLOYE", $user->getRoles()))
            $isEmploye = true;


        $session->set('isAdmin', $isAdmin);
        $session->set('isEmploye', $isEmploye);

        $session->set('user_id', $userId);
        $session->set('isLogged', true);

        return new JsonResponse([
            'status' => 'success',
        ], 200);
    }

    protected function getLoginUrl(Request $request): string
    {
        throw new \LogicException('Redirection vers une page de connexion non supportée dans une API.');
    }
}
