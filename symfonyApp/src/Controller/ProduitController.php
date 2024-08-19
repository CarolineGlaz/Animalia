<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Produits;
use App\Repository\ProduitImageRepository;

class ProduitController extends AbstractController
{
    private $entityManager;
    private $produitImageRepository;

    public function __construct(EntityManagerInterface $entityManager, ProduitImageRepository $produitImageRepository)
    {
        $this->entityManager = $entityManager;
        $this->produitImageRepository = $produitImageRepository;
    }



    #[Route('/produit/image/{idProduit}', name: 'app_image')]
    public function image(int $idProduit): Response
    {
        $images = $this->produitImageRepository->findImagesByProduit($idProduit);


        $encodedImages = [];
        foreach ($images as $index => $image) {
            $encodedImages[$index] = base64_encode(stream_get_contents($image->getData()));
        }

        $response = new JsonResponse([
            'idProduit' => $idProduit,
            'images' => $encodedImages,
        ]);

        return $response;
    }

    #[Route('/produit/data/{id}', name: 'app_produit')]
    public function index(int $id): Response
    {
        $repositoryProduit = $this->entityManager->getRepository(Produits::class);

        $produit = $repositoryProduit->find($id);
        if ($produit === null) {
            return new JsonResponse('Produit introuvable', 404);
        }

        $response = new JsonResponse([
            'produit' => $produit,
        ]);

        // Définir les en-têtes de la réponse si nécessaire (commentés ici)
        // $response->headers->set('Content-Type', 'application/json');
        // $response->headers->set('Access-Control-Allow-Origin', '*');
        // $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        // $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        // $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
