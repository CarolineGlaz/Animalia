<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\ProduitImageRepository;
use App\Repository\ProduitsRepository;
use App\Entity\Produits;

#[Route('/produit')]
class ProduitController extends AbstractController
{
    private $entityManager;
    private $produitImageRepository;

    public function __construct(EntityManagerInterface $entityManager, ProduitImageRepository $produitImageRepository)
    {
        $this->entityManager = $entityManager;
        $this->produitImageRepository = $produitImageRepository;
    }

    #[Route('/image/{idProduit}', name: 'app_image', methods: ['GET'])]
    public function image(int $idProduit): Response
    {
        $images = $this->produitImageRepository->findImagesByProduit($idProduit);

        $encodedImages = [];
        foreach ($images as $image) {
            $encodedImages[$image->getId()] = base64_encode(stream_get_contents($image->getData()));
        }

        return new JsonResponse([
            'idProduit' => $idProduit,
            'encodedImages' => $encodedImages,
            'images' => $images,
        ]);
    }

    #[Route('/data/{id}', name: 'app_produit', methods: ['GET'])]
    public function index(int $id): Response
    {
        $repositoryProduit = $this->entityManager->getRepository(Produits::class);

        $produit = $repositoryProduit->find($id);
        if ($produit === null) {
            return new JsonResponse(['message' => 'Produit introuvable'], 404);
        }

        return new JsonResponse([
            'produit' => $produit,
        ]);
    }

    #[Route('/categorie/{categorie}', name: 'produits_categorie', methods: ['GET'])]
    public function produitsParCategorie(ProduitsRepository $produitsRepository, string $categorie): JsonResponse
    {
        $produits = $produitsRepository->findByCategorie($categorie);
        return $this->json($produits);
    }

    

}
