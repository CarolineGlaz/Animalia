<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\ImageRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Image;

class ImageController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/image/{id}', name: 'app_image')]
public function index($id, ImageRepository $imageRepository): Response
{
    $repositoryImage = $this->entityManager->getRepository(Image::class);
    $image = $imageRepository->find($id);

    if (!$image) {
        throw $this->createNotFoundException('Image pas trouvée');
    }

    $imageData = $image->getData();
    
    if (is_resource($imageData)) {
        $imageData = stream_get_contents($imageData);
    }
    $longueur = strlen($imageData);


    $encodedImageData = base64_encode($imageData);

    $images = $repositoryImage->findByIdProduit($id);
    $encodedImages = [];
    foreach ($images as $i) {
        $imgData = $i->getData();
        if (is_resource($imgData)) {
            $imgData = stream_get_contents($imgData);
        }
        $encodedImages[$i->getId()] = base64_encode($imgData);
    }

    $json = [
        'longueur' => $longueur,
        'encoded_images' => $encodedImages,
        'imageData' => $encodedImageData,
    ];
    

    $response = new JsonResponse($json);

    $response->headers->set('Content-Type', 'application/json');
    $response->headers->set('Access-Control-Allow-Origin', '*');
    $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $response->headers->set('Access-Control-Allow-Credentials', 'true');

    return $response;
}

}
