<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DashboardEmployeController extends AbstractController
{
    #[Route('/dashboard/employe', name: 'app_dashboard_employe')]
    public function index(): Response
    {
        return $this->render('dashboard_employe/index.html.twig', [
            'controller_name' => 'DashboardEmployeController',
        ]);
    }
}
